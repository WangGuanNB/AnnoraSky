import {
  Bookmark,
  Check,
  Clock3,
  LockKeyhole,
  Orbit,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import ChartWheel from "./chart-wheel";
import { SAMPLE_CHART } from "./hero-chart-preview";

export type ProductPreviewVariant =
  | "chart"
  | "big-three"
  | "details"
  | "transits"
  | "saved";

export function getProductPreviewVariant(
  source?: string,
): ProductPreviewVariant | null {
  if (!source?.startsWith("annora-preview:")) return null;

  const variant = source.replace("annora-preview:", "") as ProductPreviewVariant;
  return ["chart", "big-three", "details", "transits", "saved"].includes(
    variant,
  )
    ? variant
    : null;
}

const placements = [
  ["☉", "Sun", "Libra 17°", "House 9"],
  ["☽", "Moon", "Taurus 13°", "House 4"],
  ["☿", "Mercury", "Scorpio 1°", "House 10"],
  ["♀", "Venus", "Virgo 16°", "House 8"],
] as const;

const bigThree = [
  ["☉", "Sun", "Libra", "Identity & direction"],
  ["☽", "Moon", "Taurus", "Emotional needs"],
  ["ASC", "Rising", "Aquarius", "How you meet life"],
] as const;

const transitCards = [
  ["Strongest now", "Venus trine natal Moon", "0.8° orb", "Connection & ease"],
  ["This week", "Mercury sextile natal Sun", "1.4° orb", "Ideas find a voice"],
  ["Coming next", "Mars enters your 10th house", "Sep 8", "Momentum in public life"],
] as const;

function PreviewShell({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative h-full min-h-[300px] w-full overflow-hidden bg-[#f8f1ed] p-4 sm:p-5",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full border border-[#bfa7b5]/35"
      />
      {children}
    </div>
  );
}

export default function ProductPreview({
  variant,
  label,
}: {
  variant: ProductPreviewVariant;
  label: string;
}) {
  if (variant === "chart") {
    return (
      <PreviewShell label={label} className="grid place-items-center">
        <div className="relative w-full max-w-[19rem]">
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b5c7e]">
            <span>Annora&apos;s birth chart</span>
            <span className="rounded-full bg-white/75 px-2 py-1 text-[#9a6a51]">Example</span>
          </div>
          <ChartWheel chart={SAMPLE_CHART} />
        </div>
      </PreviewShell>
    );
  }

  if (variant === "big-three") {
    return (
      <PreviewShell label={label} className="flex flex-col justify-center">
        <div className="relative rounded-[1.4rem] border border-[#ddcfd7] bg-white/85 p-4 shadow-[0_16px_45px_rgba(70,44,63,.1)] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b5c7e]">Your foundations</p>
              <p className="mt-1 font-serif text-xl text-[#352b34]">Your Big Three</p>
            </div>
            <Sparkles className="size-5 text-[#9a6a51]" aria-hidden="true" />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {bigThree.map(([symbol, name, sign, meaning]) => (
              <div key={name} className="rounded-xl border border-[#e5dbe0] bg-[#fffdfb] p-3">
                <div className="flex items-center justify-between text-[#6d465f]">
                  <span className="text-lg">{symbol}</span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.12em]">{name}</span>
                </div>
                <p className="mt-4 font-serif text-lg text-[#352b34]">{sign}</p>
                <p className="mt-1 text-[10px] leading-4 text-[#857780]">{meaning}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-xl bg-[#f2e8ed] px-3 py-2 text-[11px] leading-5 text-[#675560]">
            Libra Sun seeks balance, while a Taurus Moon needs steadiness. Aquarius Rising adds an independent first impression.
          </p>
        </div>
      </PreviewShell>
    );
  }

  if (variant === "details") {
    return (
      <PreviewShell label={label} className="flex flex-col justify-center">
        <div className="relative overflow-hidden rounded-[1.4rem] border border-[#ddcfd7] bg-white/90 shadow-[0_16px_45px_rgba(70,44,63,.1)]">
          <div className="flex items-end justify-between border-b border-[#eadfe4] px-4 py-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9a6a51]">The complete chart</p>
              <p className="mt-1 font-serif text-lg text-[#352b34]">Placements & aspects</p>
            </div>
            <span className="text-[10px] text-[#8a7d84]">Whole Sign</span>
          </div>
          <div className="divide-y divide-[#eadfe4]">
            {placements.map(([symbol, name, sign, house]) => (
              <div key={name} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-4 py-2.5">
                <span className="grid size-8 place-items-center rounded-full bg-[#f2e8ed] text-[#6d465f]">{symbol}</span>
                <div>
                  <p className="font-serif text-sm text-[#352b34]">{name}</p>
                  <p className="text-[10px] text-[#887b83]">{sign}</p>
                </div>
                <span className="rounded-full bg-[#f5eee8] px-2 py-1 text-[9px] font-semibold text-[#805f4e]">{house}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 bg-[#faf5f1] p-3 text-[10px] text-[#6d5f67]">
            <span className="rounded-lg border border-[#e4d8dd] bg-white px-3 py-2">△ Sun trine Moon</span>
            <span className="rounded-lg border border-[#e4d8dd] bg-white px-3 py-2">☍ Venus opposite Saturn</span>
          </div>
        </div>
      </PreviewShell>
    );
  }

  if (variant === "saved") {
    return (
      <PreviewShell label={label} className="flex flex-col justify-center">
        <div className="relative rounded-[1.4rem] border border-[#ddcfd7] bg-white/88 p-4 shadow-[0_16px_45px_rgba(70,44,63,.1)] sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#8b5c7e]">Saved on this device</p>
              <p className="mt-1 font-serif text-xl text-[#352b34]">Your charts</p>
            </div>
            <LockKeyhole className="size-5 text-[#9a6a51]" aria-hidden="true" />
          </div>
          <div className="mt-4 space-y-2">
            {["My birth chart", "Alex", "Compatibility notes"].map((name, index) => (
              <div key={name} className="flex items-center gap-3 rounded-xl border border-[#e6dce1] bg-[#fffdfb] px-3 py-3">
                <span className="grid size-9 place-items-center rounded-full bg-[#5d3c55] font-serif text-sm text-white">{index === 0 ? "AS" : index === 1 ? "A" : "♡"}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-sm text-[#392e37]">{name}</span>
                  <span className="block text-[10px] text-[#8a7c84]">Updated today</span>
                </span>
                {index === 0 ? <Check className="size-4 text-[#607c65]" /> : <Bookmark className="size-4 text-[#9a8792]" />}
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-2 text-[10px] text-[#84767e]">
            <LockKeyhole className="size-3" /> No account required
          </p>
        </div>
      </PreviewShell>
    );
  }

  return (
    <PreviewShell label={label} className="bg-[#302630] text-white">
      <div className="relative flex h-full flex-col justify-center">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#d9b8ce]">
              <Orbit className="size-3.5" aria-hidden="true" /> Your chart, in motion
            </p>
            <p className="mt-2 font-serif text-xl">What&apos;s active now</p>
          </div>
          <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-1 text-[9px] text-[#d8cdd3]">Example preview</span>
        </div>
        <div className="mt-4 space-y-2">
          {transitCards.map(([time, title, detail, meaning]) => (
            <div key={title} className="rounded-xl border border-white/10 bg-white/[0.07] p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#d5a87d]">{time}</span>
                <span className="text-[9px] text-[#c3b4bd]">{detail}</span>
              </div>
              <p className="mt-1.5 font-serif text-sm text-white">{title}</p>
              <p className="mt-1 text-[10px] text-[#d6cbd1]">{meaning}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-2 text-[10px] text-[#bfaebb]">
          <Clock3 className="size-3" /> Refreshes as the sky changes
        </p>
      </div>
    </PreviewShell>
  );
}
