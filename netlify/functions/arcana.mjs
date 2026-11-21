// Arcana tarot reader — server-side proxy to the Claude API.
// The browser calls POST /api/arcana; the API key never leaves this function.
import Anthropic from "@anthropic-ai/sdk";

// ── MODEL ──
// Change the model here, or set ANTHROPIC_MODEL in Netlify's environment variables.
const DEFAULT_MODEL = "claude-haiku-5-5";
const MODEL = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

// ── LIMITS ──
const READING_MAX_TOKENS = 4000; // Celtic Cross (10 cards × interpretation + detail) needs the headroom
const CHAT_MAX_TOKENS = 500;
const MAX_QUESTION_CHARS = 500; // free-text focus and each chat message
const MAX_CHAT_MESSAGES = 20; // user + assistant turns per reading (10 questions)
const MAX_ASSISTANT_CHARS = 4000; // replies are capped by CHAT_MAX_TOKENS anyway
const MAX_INTERPRETATION_CHARS = 800;
const MAX_OVERALL_CHARS = 2000;
const MAX_BODY_BYTES = 40000;

export const config = {
  path: "/api/arcana",
  // Netlify blocks with a 429 once a visitor exceeds this (enforcement can lag ~10s)
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

// Mirrors KEYWORDS and SPREADS in arcana.html — keep them in sync.
const KEYWORDS = {
  "The Fool":"new beginnings, spontaneity, innocence","The Magician":"manifestation, willpower, skill",
  "The High Priestess":"intuition, mystery, inner knowing","The Empress":"fertility, abundance, nurturing",
  "The Emperor":"authority, structure, stability","The Hierophant":"tradition, guidance, spiritual wisdom",
  "The Lovers":"love, union, alignment","The Chariot":"willpower, victory, determination",
  "Strength":"courage, patience, inner strength","The Hermit":"solitude, inner guidance, introspection",
  "Wheel of Fortune":"change, cycles, fate","Justice":"truth, fairness, cause and effect",
  "The Hanged Man":"surrender, new perspective, pause","Death":"endings, transformation, transition",
  "Temperance":"balance, patience, integration","The Devil":"bondage, materialism, shadow self",
  "The Tower":"sudden upheaval, revelation","The Star":"hope, faith, renewal",
  "The Moon":"illusion, subconscious, dreams","The Sun":"joy, vitality, clarity",
  "Judgement":"reflection, awakening, reckoning","The World":"completion, wholeness",
  "Ace of Cups":"new love, compassion","Two of Cups":"partnership, connection",
  "Three of Cups":"celebration, community","Four of Cups":"contemplation, re-evaluation",
  "Five of Cups":"loss, grief, refocusing","Six of Cups":"nostalgia, innocence, reunion",
  "Seven of Cups":"fantasy, choices, illusion","Eight of Cups":"walking away, deeper meaning",
  "Nine of Cups":"contentment, wishes fulfilled","Ten of Cups":"harmony, bliss, fulfillment",
  "Page of Cups":"intuitive messages, creativity","Knight of Cups":"romance, following the heart",
  "Queen of Cups":"emotional depth, compassion","King of Cups":"emotional mastery, balance",
  "Ace of Pentacles":"material opportunity, beginnings","Two of Pentacles":"balance, adaptability",
  "Three of Pentacles":"teamwork, skill","Four of Pentacles":"security, conservation",
  "Five of Pentacles":"hardship, financial worry","Six of Pentacles":"generosity, balance",
  "Seven of Pentacles":"patience, investment","Eight of Pentacles":"diligence, mastery",
  "Nine of Pentacles":"luxury, self-sufficiency","Ten of Pentacles":"legacy, security",
  "Page of Pentacles":"ambition, new study","Knight of Pentacles":"methodical, responsible",
  "Queen of Pentacles":"nurturing, practical abundance","King of Pentacles":"wealth, leadership",
  "Ace of Swords":"clarity, breakthrough, truth","Two of Swords":"indecision, blocked emotion",
  "Three of Swords":"heartbreak, sorrow","Four of Swords":"rest, recovery",
  "Five of Swords":"conflict, defeat","Six of Swords":"transition, moving forward",
  "Seven of Swords":"strategy, deception","Eight of Swords":"restriction, self-imposed limits",
  "Nine of Swords":"anxiety, fear","Ten of Swords":"painful endings, betrayal",
  "Page of Swords":"curiosity, communication","Knight of Swords":"swift action, ambition",
  "Queen of Swords":"clarity, directness","King of Swords":"intellectual authority",
  "Ace of Wands":"inspiration, creative spark","Two of Wands":"planning, future vision",
  "Three of Wands":"expansion, progress","Four of Wands":"celebration, harmony",
  "Five of Wands":"competition, restless energy","Six of Wands":"victory, recognition",
  "Seven of Wands":"standing your ground","Eight of Wands":"rapid movement, momentum",
  "Nine of Wands":"resilience, persistence","Ten of Wands":"burden, overextension",
  "Page of Wands":"enthusiasm, discovery","Knight of Wands":"adventure, passion",
  "Queen of Wands":"confidence, determination","King of Wands":"vision, leadership"
};

const SPREADS = {
  'Daily Pull':['Guidance'],
  'Past · Present · Future':['Past','Present','Future'],
  'Mind · Body · Spirit':['Mind','Body','Spirit'],
  'Five Card Cross':['Situation','What Helps','What Blocks','Past Influence','Likely Outcome'],
  'Horseshoe':['Past','Present','Hidden Influences','Obstacles','External Forces','Best Action','Outcome'],
  'Celtic Cross':['The Present','The Challenge','Foundation','The Past','Crowning Thought','Near Future','Your Attitude','Others\' Influence','Hopes & Fears','The Outcome']
};

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

class BadRequest extends Error {}

export default async (req, context) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[arcana] ANTHROPIC_API_KEY is not set");
    return json({ error: "unavailable" }, 503);
  }

  let body;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) throw new BadRequest("body too large");
    body = JSON.parse(raw);
  } catch (e) {
    return json({ error: "bad_request" }, 400);
  }

  try {
    if (body?.mode === "reading") return json({ reading: await reading(body) });
    if (body?.mode === "chat") return json({ reply: await chat(body) });
    throw new BadRequest("unknown mode");
  } catch (e) {
    if (e instanceof BadRequest) {
      console.warn(`[arcana] rejected request from ${context.ip}: ${e.message}`);
      return json({ error: e.message === "conversation_limit" ? "conversation_limit" : "bad_request" }, 400);
    }
    logApiError(e);
    const status = e instanceof Anthropic.RateLimitError ? 429 : 502;
    return json({ error: "unavailable" }, status);
  }
};

// ── READING ──
async function reading({ layout, focus, cards }) {
  const positions = SPREADS[layout];
  if (!positions) throw new BadRequest("unknown spread");
  if (!Array.isArray(cards) || cards.length !== positions.length) throw new BadRequest("wrong card count");
  if (new Set(cards).size !== cards.length || !cards.every(c => KEYWORDS[c])) throw new BadRequest("unknown card");
  const topic = cleanText(focus, MAX_QUESTION_CHARS) || null;

  const cardsStr = cards.map((name, i) => `Position "${positions[i]}": ${name} (${KEYWORDS[name]})`).join('\n');
  const prompt = `You are a wise, poetic tarot reader. Give a reading using the ${layout} spread.\n${topic?`The seeker's focus: ${topic}`:'This is an open general reading.'}\n\nCards drawn:\n${cardsStr}\n\nFor each card provide TWO things:\n- "interpretation": 2-3 evocative, personal sentences (about 40-55 words) connecting the card to its position and the seeker's focus. Be specific to the card's imagery and position — not generic.\n- "detail": 4-6 rich sentences (about 80-110 words) exploring the card more deeply — its symbolism, what it asks of the seeker, what energy or shift is being called for, and any shadow or gift it carries in this position. Make it feel like a real tarot reader speaking directly to the person.\nSpeak directly using "you". Be evocative, warm, and personal — not a dictionary definition.\n\nEnd with an "Overall Message" of 4-5 sentences that weaves the cards together into a coherent arc. Speak to the thread running through the reading and what the seeker is being invited toward.\n\nReturn ONLY valid JSON, no markdown:\n{"cards":[{"position":"...","card":"...","interpretation":"...","detail":"..."}],"overall":"..."}`;

  const text = await ask({ max_tokens: READING_MAX_TOKENS, messages: [{ role: "user", content: prompt }] });
  let parsed;
  try {
    parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (e) {
    throw new Error(`reading was not valid JSON: ${text.slice(0, 200)}`);
  }
  if (!Array.isArray(parsed?.cards) || parsed.cards.length !== cards.length) {
    throw new Error(`reading had ${parsed?.cards?.length} cards, expected ${cards.length}`);
  }
  return parsed;
}

// ── CHAT ──
async function chat({ layout, topic, cards, overall, messages }) {
  const positions = SPREADS[layout];
  if (!positions) throw new BadRequest("unknown spread");
  if (!Array.isArray(cards) || cards.length !== positions.length) throw new BadRequest("wrong card count");
  if (!cards.every((c, i) => c && KEYWORDS[c.card] && c.position === positions[i])) throw new BadRequest("unknown card");
  if (!Array.isArray(messages) || messages.length === 0) throw new BadRequest("no messages");
  if (messages.length > MAX_CHAT_MESSAGES) throw new BadRequest("conversation_limit");
  const history = messages.map((m, i) => {
    const role = i % 2 === 0 ? "user" : "assistant";
    if (m?.role !== role || typeof m.content !== "string" || !m.content.trim()) throw new BadRequest("malformed history");
    const limit = role === "user" ? MAX_QUESTION_CHARS : MAX_ASSISTANT_CHARS;
    if (m.content.length > limit) throw new BadRequest("message too long");
    return { role, content: m.content };
  });
  if (history.at(-1).role !== "user") throw new BadRequest("last message must be from the seeker");

  const focus = cleanText(topic, MAX_QUESTION_CHARS);
  const spreadCtx = cards.map(c => `${c.position}: ${c.card} — ${cleanText(c.interpretation, MAX_INTERPRETATION_CHARS)}`).join('\n');
  const systemPrompt = `You are a wise, poetic tarot reader continuing a conversation about this reading.
Spread: ${layout}${focus?'\nFocus: '+focus:''}
Cards drawn:\n${spreadCtx}
Overall message: ${cleanText(overall, MAX_OVERALL_CHARS)}

Keep responses warm, personal, and thoughtful — 3-5 sentences. Speak directly to the seeker using "you". Be specific to the cards and context, not generic.`;

  return ask({ max_tokens: CHAT_MAX_TOKENS, system: systemPrompt, messages: history });
}

// ── HELPERS ──
async function ask(params) {
  const response = await client.messages.create({
    model: MODEL,
    // Short creative replies don't need extended thinking; off keeps cost and latency down
    thinking: { type: "disabled" },
    ...params,
  });
  if (response.stop_reason === "refusal") {
    throw new Error(`model refused (${response.stop_details?.category ?? "no category"})`);
  }
  const text = response.content.find(b => b.type === "text")?.text?.trim();
  if (!text) throw new Error(`empty response (stop_reason: ${response.stop_reason})`);
  return text;
}

function cleanText(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function logApiError(e) {
  if (e instanceof Anthropic.AuthenticationError) {
    console.error("[arcana] Anthropic rejected the API key — check ANTHROPIC_API_KEY", e.message);
  } else if (e instanceof Anthropic.NotFoundError) {
    console.error(`[arcana] model "${MODEL}" not found — check ANTHROPIC_MODEL`, e.message);
  } else if (e instanceof Anthropic.RateLimitError) {
    console.error("[arcana] Anthropic rate limit hit", e.message);
  } else if (e instanceof Anthropic.APIError) {
    console.error(`[arcana] Anthropic API error ${e.status}`, e.message);
  } else {
    console.error("[arcana] reading failed", e);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
