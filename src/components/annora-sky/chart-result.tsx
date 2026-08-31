"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Check,
  Clock3,
  Compass,
  Info,
  LockKeyhole,
  MapPin,
  Orbit,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  calculateBirthChart,
  calculateCurrentTransits,
  formatPlacement,
} from "@/lib/astrology/calculate";
import {
  angleInterpretation,
  bigThreeSummary,
  placementInterpretation,
} from "@/lib/astrology/interpret";
import { getPendingChart, saveChartToDevice } from "@/lib/astrology/storage";
import type { BirthChart } from "@/lib/astrology/types";

import ChartWheel from "./chart-wheel";
import { AnnoraButton, AnnoraCard, AnnoraEyebrow } from "./annora-ui";

export default function ChartResult() {
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const details = getPendingChart();
    if (!details) {
      setError("No birth details were found in this browser.");
      return;
    }

    try {
      setChart(calculateBirthChart(details));
    } catch (calculationError) {
      setError(
        calculationError instanceof Error
          ? calculationError.message
          : "Your chart could not be calculated."
      );
    }
  }, []);

  const transits = useMemo(
    () => (chart ? calculateCurrentTransits(chart) : null),
    [chart]
  );

  if (error) {
    return (
      <section className="min-h-[72vh] bg-annora-page px-4 pb-20 pt-36 sm:px-6">
        <AnnoraCard className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-annora-card sm:p-12">
          <Info className="mx-auto size-7 text-annora-mauve" aria-hidden="true" />
          <h1 className="mt-5 font-serif text-3xl text-annora-heading">Let&apos;s start with your birth details</h1>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-[#71656d]">{error}</p>
          <AnnoraButton asChild className="mx-auto mt-7 w-fit">
            <Link href="/#birth-chart">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Return to the calculator
            </Link>
          </AnnoraButton>
        </AnnoraCard>
      </section>
    );
  }

  if (!chart || !transits) {
    return (
      <section className="grid min-h-[70vh] place-items-center bg-annora-page px-4 pt-24 text-center">
        <div>
          <Orbit className="mx-auto size-7 animate-spin text-[#8b5c7e]" aria-hidden="true" />
          <p className="mt-4 font-serif text-2xl text-[#3b2e38]">Calculating your sky</p>
        </div>
      </section>
    );
  }

  const sun = chart.placements.find((placement) => placement.key === "sun");
  const moon = chart.placements.find((placement) => placement.key === "moon");
  const bigThree = [sun, moon, chart.ascendant].filter(Boolean);
  const displayName = chart.details.name || "Your";
  const formattedDate = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${chart.details.birthDate}T12:00:00`));

  function saveChart() {
    saveChartToDevice(chart!.details);
    setSaved(true);
  }

  return (
    <div className="bg-annora-page text-annora-ink">
      <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 md:pb-24 md:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(213,190,209,.42),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(224,197,176,.42),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <AnnoraButton tone="text" asChild className="text-sm">
            <Link href="/#birth-chart">
              <ArrowLeft className="size-4" aria-hidden="true" />
              New chart
            </Link>
          </AnnoraButton>

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-18">
            <div>
              <AnnoraEyebrow>
                <Sparkles className="size-3.5" aria-hidden="true" />
                {chart.system}
              </AnnoraEyebrow>
              <h1 className="mt-7 font-serif text-5xl leading-[0.98] tracking-[-0.04em] text-annora-ink sm:text-6xl">
                {displayName} birth chart
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#675b63]">
                {bigThreeSummary(chart)}
              </p>

              <div className="mt-8 grid gap-3 text-sm text-[#5f535b] sm:grid-cols-2">
                <span className="flex items-center gap-2 rounded-xl border border-[#dfd3d9] bg-white/70 px-4 py-3">
                  <Clock3 className="size-4 text-[#8b5c7e]" aria-hidden="true" />
                  {formattedDate}
                  {chart.details.unknownTime ? " · time unknown" : ` · ${chart.details.birthTime}`}
                </span>
                <span className="flex items-center gap-2 rounded-xl border border-[#dfd3d9] bg-white/70 px-4 py-3">
                  <MapPin className="size-4 text-[#8b5c7e]" aria-hidden="true" />
                  {chart.details.location.label}
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <AnnoraButton
                  type="button"
                  onClick={saveChart}
                >
                  {saved ? <Check className="size-4" /> : <Bookmark className="size-4" />}
                  {saved ? "Saved to this device" : "Save this chart"}
                </AnnoraButton>
                <AnnoraButton tone="outline" asChild>
                  <Link href="/saved-charts">View saved charts</Link>
                </AnnoraButton>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-[#857780]">
                <LockKeyhole className="size-3.5 shrink-0" aria-hidden="true" />
                Saving keeps these details only in this browser. No account is required.
              </p>
            </div>

            <ChartWheel chart={chart} />
          </div>

          {chart.timeNotice && (
            <Alert className="mt-10 flex gap-3 rounded-2xl border-[#d7c3b6] bg-[#f7ede5] text-[#6c5142] [&>svg]:static [&>svg+div]:translate-y-0 [&>svg~*]:pl-0">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <AlertDescription className="leading-6">{chart.timeNotice}</AlertDescription>
            </Alert>
          )}
        </div>
      </section>

      <section className="border-y border-[#e1d5da] bg-[#fffdfb] px-4 py-18 sm:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b5c7e]">Your foundations</p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.035em] sm:text-5xl">Your Big Three</h2>
            <p className="mt-4 text-lg leading-8 text-[#71656c]">
              These are the clearest starting points: identity, emotional needs, and—when an exact birth time is available—how you meet life.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {bigThree.map((placement) =>
              placement ? (
                <AnnoraCard key={placement.name} role="article" className="rounded-[1.6rem] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b84]">{placement.name}</p>
                      <h3 className="mt-2 font-serif text-3xl text-[#352b34]">
                        {placement.sign.symbol} {placement.sign.name}
                      </h3>
                    </div>
                    <Badge className="rounded-full bg-[#eee1e8] px-3 py-1 text-xs font-semibold text-annora-plum-muted hover:bg-[#eee1e8]">
                      {formatPlacement(placement)}
                    </Badge>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[#6f626a]">
                    {"key" in placement
                      ? placementInterpretation(placement)
                      : angleInterpretation(placement)}
                  </p>
                </AnnoraCard>
              ) : null
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-18 sm:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a6a51]">The complete chart</p>
              <h2 className="mt-4 font-serif text-4xl tracking-[-0.035em] sm:text-5xl">Planetary placements</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#7b6e76]">
              Retrograde is marked with ℞. Houses use the Whole Sign system and appear only when an exact birth time is provided.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-[#ded1d7] bg-white">
            <div className="grid divide-y divide-[#eadfe4] md:grid-cols-2 md:divide-x md:divide-y-0">
              {[chart.placements.slice(0, 5), chart.placements.slice(5)].map((group, groupIndex) => (
                <div key={groupIndex} className="divide-y divide-[#eadfe4]">
                  {group.map((placement) => (
                    <details key={placement.key} className="group px-5 py-4 sm:px-6">
                      <summary className="flex cursor-pointer list-none items-center gap-4 marker:content-none">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f2e8ed] text-xl text-[#664559]">
                          {placement.symbol}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-serif text-lg text-[#382d36]">{placement.name}</span>
                          <span className="block text-xs text-[#887b83]">{formatPlacement(placement)}</span>
                        </span>
                        {placement.house && (
                          <span className="rounded-full bg-[#f5eee8] px-3 py-1 text-xs font-semibold text-[#805f4e]">
                            House {placement.house}
                          </span>
                        )}
                        {placement.retrograde && <span className="text-sm font-semibold text-[#8b5c7e]">℞</span>}
                        <span className="text-xl text-[#8b7b84] transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="pl-14 pt-3 text-sm leading-7 text-[#71656c]">
                        {placementInterpretation(placement)}
                      </p>
                    </details>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e1d5da] bg-[#fffdfb] px-4 py-18 sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b5c7e]">How the pieces speak</p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.035em] sm:text-5xl">Major aspects</h2>
            <p className="mt-5 text-base leading-7 text-[#71656c]">
              Aspects describe geometric relationships between planets. A close orb usually makes the pattern more noticeable.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {chart.aspects.slice(0, 10).map((aspect) => (
              <AnnoraCard key={`${aspect.bodyA.key}-${aspect.bodyB.key}-${aspect.name}`} role="article" className="rounded-2xl border-[#dfd3d9] p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xl text-[#6d465f]" aria-hidden="true">{aspect.symbol}</span>
                  <span className="text-xs font-semibold text-[#8b7b84]">{aspect.orb.toFixed(1)}° orb</span>
                </div>
                <h3 className="mt-4 font-serif text-lg text-[#352b34]">
                  {aspect.bodyA.name} {aspect.name.toLowerCase()} {aspect.bodyB.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#786b73]">
                  This links {aspect.bodyA.name.toLowerCase()} themes with {aspect.bodyB.name.toLowerCase()} themes through a {aspect.name.toLowerCase()} pattern.
                </p>
              </AnnoraCard>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#302630] px-4 py-18 text-white sm:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d5b7cb]">
                <Orbit className="size-4" aria-hidden="true" />
                Your chart, in motion
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">What is active now</h2>
              <p className="mt-5 text-base leading-7 text-[#d7cdd3]">
                These are the closest current planetary contacts to your natal chart. They change over time, giving you a reason to return beyond a one-time reading.
              </p>
              <div className="mt-7 flex items-center gap-2 text-xs text-[#bfaebb]">
                <RefreshCw className="size-3.5" aria-hidden="true" />
                Snapshot for {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(transits.calculatedAt))}
              </div>
            </div>

            <div className="space-y-4">
              {transits.aspects.length > 0 ? (
                transits.aspects.map((transit, index) => (
                  <AnnoraCard key={`${transit.transitPlanet.key}-${transit.natalPlanet.key}-${transit.name}`} role="article" className="rounded-2xl border-white/10 bg-white/[0.06] p-5 text-white shadow-none">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d3a880]">
                        {index === 0 ? "Strongest now" : transit.strengthLabel}
                      </span>
                      <span className="text-xs text-[#c2b4bd]">{transit.orb.toFixed(1)}° orb</span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl">{transit.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#d7cdd3]">{transit.interpretation}</p>
                  </AnnoraCard>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-sm leading-7 text-[#d7cdd3]">
                  No major transit is currently within the close-orb filter. Your live planetary positions are still available in the calculation, and this list will change as the sky moves.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-[#d9cad3] bg-[#f2e9ed] p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a506a]">
              <Compass className="size-4" aria-hidden="true" />
              Transparent by design
            </p>
            <h2 className="mt-3 font-serif text-2xl text-[#352b34]">Calculated first. Explained second.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6d5e67]">
              This chart uses the Western tropical zodiac, Astronomy Engine planetary positions, IANA time-zone conversion, Whole Sign houses, and documented major-aspect orbs. Interpretations are automated and offered for reflection and entertainment.
            </p>
          </div>
          <AnnoraButton tone="outline" asChild className="h-11 text-sm">
            <Link href="/#methodology">How it works</Link>
          </AnnoraButton>
        </div>
      </section>
    </div>
  );
}
