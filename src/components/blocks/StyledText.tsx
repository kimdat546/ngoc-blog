import type { ReactNode } from "react";
import { BLOCK_FONTS, type BlockFont } from "./fonts";

const COLORS = {
  forest: "text-forest",
  moss: "text-moss",
  sage: "text-sage",
  brown: "text-soft-brown",
  golden: "text-golden",
  rose: "text-rose-400",
} as const;

const ALIGNS = { left: "text-left", center: "text-center", right: "text-right" } as const;

const SIZES = { small: "text-base", normal: "text-lg", large: "text-2xl leading-snug" } as const;

type Color = keyof typeof COLORS;
type Align = keyof typeof ALIGNS;
type Size = keyof typeof SIZES;

function pick<T extends object>(map: T, value: unknown, fallback: keyof T): keyof T {
  return typeof value === "string" && value in map ? (value as keyof T) : fallback;
}

export interface StyledTextOptions {
  color?: unknown;
  font?: unknown;
  align?: unknown;
  size?: unknown;
}

// A passage with its own colour / font / alignment / size, chosen in Contentful.
// Rich text can't colour words inline, so this works at the block level.
export default function StyledText({ options, children }: { options: StyledTextOptions; children: ReactNode }) {
  const color = COLORS[pick(COLORS, options.color, "forest") as Color];
  const font = BLOCK_FONTS[pick(BLOCK_FONTS, options.font, "serif") as BlockFont];
  const align = ALIGNS[pick(ALIGNS, options.align, "left") as Align];
  const size = SIZES[pick(SIZES, options.size, "normal") as Size];
  // Handwritten fonts read small at the same size, so bump them up.
  const fontBoost =
    options.font === "handwriting" ? "text-[1.25em]" : options.font === "notebook" ? "text-[1.15em]" : "";

  return (
    <div className={`my-6 [&>*:last-child]:mb-0 ${color} ${font} ${align} ${size}`}>
      <div className={fontBoost}>{children}</div>
    </div>
  );
}
