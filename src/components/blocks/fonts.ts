import { Be_Vietnam_Pro, Dancing_Script, Patrick_Hand, Playfair_Display } from "next/font/google";

// Fonts authors can pick for a "Styled Text" block. All support Vietnamese.
const dancingScript = Dancing_Script({ subsets: ["vietnamese"], display: "swap" });
const patrickHand = Patrick_Hand({ subsets: ["vietnamese"], weight: "400", display: "swap" });
const playfair = Playfair_Display({ subsets: ["vietnamese"], style: ["normal", "italic"], display: "swap" });
const beVietnam = Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: ["400", "600"], display: "swap" });

export const BLOCK_FONTS = {
  serif: "", // site default (Source Serif 4)
  handwriting: dancingScript.className,
  notebook: patrickHand.className,
  elegant: playfair.className,
  sans: beVietnam.className,
} as const;

export type BlockFont = keyof typeof BLOCK_FONTS;
