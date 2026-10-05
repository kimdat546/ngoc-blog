import { PiFlowerLotusDuotone, PiLeafDuotone, PiSparkleDuotone } from "react-icons/pi";

export type DividerStyle = "leaf" | "flower" | "sparkle" | "dots" | "line";

export const DIVIDER_STYLES: DividerStyle[] = ["leaf", "flower", "sparkle", "dots", "line"];

const ICONS = {
  leaf: PiLeafDuotone,
  flower: PiFlowerLotusDuotone,
  sparkle: PiSparkleDuotone,
};

// Section break between parts of a post. Also used for the built-in rich-text
// horizontal rule (default "leaf").
export default function Divider({ variant = "leaf" }: { variant?: DividerStyle }) {
  if (variant === "line") {
    return <hr className="my-12 mx-auto w-1/3 border-0 h-px bg-sage/40" />;
  }

  if (variant === "dots") {
    return (
      <div role="separator" className="my-12 flex justify-center gap-4 text-sage/70 text-xl tracking-[0.5em]">
        <span aria-hidden="true">• • •</span>
      </div>
    );
  }

  const Icon = ICONS[variant];
  return (
    <div role="separator" className="my-12 flex items-center justify-center gap-4 text-sage/70">
      <span className="h-px w-20 bg-gradient-to-r from-transparent to-sage/40" />
      <Icon className="text-xl" aria-hidden="true" />
      <span className="h-px w-20 bg-gradient-to-l from-transparent to-sage/40" />
    </div>
  );
}
