import type { ReactNode } from "react";

// Inline colour syntax for Contentful rich text (which has no colour mark):
//   (chữ cần tô)[hồng]            text colour
//   (chữ cần tô)[nền vàng]        highlight
//   (chữ cần tô)[đỏ, nền vàng]    both
//   (chữ cần tô)[#8a3ffc]         any hex colour
// Anything whose [...] isn't a known colour is left untouched, so normal
// text like "(xem thêm)[1]" is safe.

const TEXT_COLORS: Record<string, string> = {
  rừng: "text-forest",
  rêu: "text-moss",
  "xanh nhạt": "text-sage",
  nâu: "text-soft-brown",
  vàng: "text-[#b08415]",
  hồng: "text-rose-500",
  đỏ: "text-red-700",
  "xanh dương": "text-sky-700",
  tím: "text-purple-600",
  cam: "text-orange-600",
};

const HIGHLIGHTS: Record<string, string> = {
  vàng: "bg-yellow-200/70",
  hồng: "bg-rose-100",
  rêu: "bg-moss/15",
  "xanh nhạt": "bg-sage/20",
  "xanh dương": "bg-sky-100",
  tím: "bg-purple-100",
  cam: "bg-orange-100",
  nâu: "bg-amber-100",
};

// Unaccented and English spellings map onto the Vietnamese names above.
const ALIASES: Record<string, string> = {
  rung: "rừng", forest: "rừng",
  reu: "rêu", moss: "rêu", "xanh rêu": "rêu", "xanh reu": "rêu", "xanh lá": "rêu", "xanh la": "rêu", green: "rêu",
  "xanh nhat": "xanh nhạt", sage: "xanh nhạt",
  nau: "nâu", brown: "nâu",
  vang: "vàng", gold: "vàng", golden: "vàng", yellow: "vàng",
  hong: "hồng", pink: "hồng", rose: "hồng",
  do: "đỏ", red: "đỏ",
  "xanh duong": "xanh dương", xanh: "xanh dương", blue: "xanh dương",
  tim: "tím", purple: "tím",
  orange: "cam",
};

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const HIGHLIGHT_PREFIX_RE = /^(?:nền|nen|bg|highlight)\s+/;
const SYNTAX_RE = /\(([^()\n]+)\)\[([^[\]\n]+)\]/g;

interface ColorStyle {
  className: string;
  color?: string;
}

function normalize(token: string) {
  const t = token.normalize("NFC").trim().toLowerCase().replace(/\s+/g, " ");
  return ALIASES[t] ?? t;
}

// Parses "đỏ, nền vàng" → classes/style, or null if any part is unknown.
function parseSpec(spec: string): ColorStyle | null {
  const classes: string[] = [];
  let color: string | undefined;

  for (const raw of spec.split(",")) {
    const token = raw.normalize("NFC").trim().toLowerCase();
    if (!token) return null;

    if (HEX_RE.test(token)) {
      color = token;
      continue;
    }
    if (HIGHLIGHT_PREFIX_RE.test(token)) {
      const bg = HIGHLIGHTS[normalize(token.replace(HIGHLIGHT_PREFIX_RE, ""))];
      if (!bg) return null;
      classes.push(bg, "px-1 rounded-sm box-decoration-clone");
      continue;
    }
    const text = TEXT_COLORS[normalize(token)];
    if (!text) return null;
    classes.push(text);
  }

  return { className: classes.join(" "), color };
}

// Used as `renderText` for rich text: turns colour syntax into styled spans.
export function renderColoredText(text: string): ReactNode {
  if (!text.includes(")[")) return text;

  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(SYNTAX_RE)) {
    const style = parseSpec(match[2]);
    if (!style) continue;
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <span key={match.index} className={style.className} style={style.color ? { color: style.color } : undefined}>
        {match[1]}
      </span>
    );
    last = match.index + match[0].length;
  }
  if (parts.length === 0) return text;
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// For plain-text uses (search, card excerpts, meta description): keep the words,
// drop the colour syntax.
export function stripColorSyntax(text: string): string {
  if (!text?.includes(")[")) return text;
  return text.replace(SYNTAX_RE, (whole, inner: string, spec: string) => (parseSpec(spec) ? inner : whole));
}
