import type { ReactNode } from "react";
import { PiHeartDuotone, PiInfoDuotone, PiLeafDuotone, PiSealWarningDuotone } from "react-icons/pi";

export type CalloutVariant = "note" | "leaf" | "heart" | "important";

const VARIANTS = {
  note: { icon: PiInfoDuotone, box: "bg-cream/70 border-sage/40", icon_: "text-sage" },
  leaf: { icon: PiLeafDuotone, box: "bg-moss/[0.07] border-moss/40", icon_: "text-moss" },
  heart: { icon: PiHeartDuotone, box: "bg-rose-50 border-rose-200", icon_: "text-rose-400" },
  important: { icon: PiSealWarningDuotone, box: "bg-golden/10 border-golden/50", icon_: "text-soft-brown" },
} satisfies Record<CalloutVariant, unknown>;

export function toCalloutVariant(value: unknown): CalloutVariant {
  return typeof value === "string" && value in VARIANTS ? (value as CalloutVariant) : "note";
}

// Highlighted box inside a post (tip, note, something from the heart...).
export default function Callout({
  variant,
  title,
  children,
}: {
  variant: CalloutVariant;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, box, icon_ } = VARIANTS[variant];
  return (
    <aside className={`not-prose my-8 flex gap-4 rounded-2xl border-l-4 px-5 py-4 sm:px-6 sm:py-5 ${box}`}>
      <Icon className={`mt-1 shrink-0 text-2xl ${icon_}`} aria-hidden="true" />
      <div className="min-w-0 text-base leading-relaxed [&>*:last-child]:mb-0 [&_p]:mb-3">
        {title && <p className="font-semibold text-forest !mb-1">{title}</p>}
        {children}
      </div>
    </aside>
  );
}
