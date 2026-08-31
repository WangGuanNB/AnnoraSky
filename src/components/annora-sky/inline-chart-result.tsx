"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  Clock3,
  Edit3,
  Info,
  LockKeyhole,
  MapPin,
  Orbit,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "@/i18n/navigation";
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
import { saveChartToDevice } from "@/lib/astrology/storage";
import type { BirthDetails } from "@/lib/astrology/types";

import { AnnoraButton, AnnoraCard, AnnoraEyebrow } from "./annora-ui";
import ChartWheel from "./chart-wheel";

export default function InlineChartResult({ details }: { details: BirthDetails }) {
  const [saved, setSaved] = useState(false);
  const result = useMemo(() => {
    try {
      const chart = calculateBirthChart(details);
      return {
        chart,
        transits: calculateCurrentTransits(chart),
        error: "",
      };
    } catch (error) {
      return {
        chart: null,
        transits: null,
        error: error instanceof Error ? error.message : "Your chart could not be calculated.",
      };
    }
  }, [details]);

  if (!result.chart || !result.transits) {
    return (
      <section
        id="your-chart"
        className="scroll-mt-24 border-y border-annora-border bg-annora-page px-4 py-16 sm:px-6"
      >
        <Alert className="mx-auto max-w-3xl rounded-2xl border-[#d9bbb9] bg-[#fbefed] text-[#744542]">
          <Info className="size-4" aria-hidden="true" />
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      </section>
    );
  }

  const { chart, transits } = result;
  const sun = chart.placements.find((placement) => placement.key === "sun");
  const moon = chart.placements.find((placement) => placement.key === "moon");
  const foundations = [sun, moon, chart.ascendant].filter(Boolean);
  const displayName = chart.details.name?.trim();
  const formattedDate = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${chart.details.birthDate}T12:00:00`));

  function saveChart() {
    saveChartToDevice(chart.details);
    setSaved(true);
  }

  return (
    <section
      id="your-chart"
      aria-labelledby="your-chart-title"
      aria-live="polite"
      className="relative scroll-mt-20 overflow-hidden border-y border-annora-border bg-annora-page px-4 py-16 sm:scroll-mt-24 sm:px-6 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(205,177,198,.28),transparent_30%),radial-gradient(circle_at_92%_12%,rgba(224,193,167,.3),transparent_27%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <AnnoraEyebrow className="w-fit bg-white/80">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Your chart is ready
          </AnnoraEyebrow>
          <AnnoraButton
            tone="text"
            type="button"
            onClick={() =>
              document
                .getElementById("birth-chart")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="w-fit gap-2 text-sm"
          >
            <Edit3 className="size-4" aria-hidden="true" />
            Edit birth details
          </AnnoraButton>
        </div>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-annora-mauve">
              {chart.system}
            </p>
            <h2
              id="your-chart-title"
              className="mt-4 text-balance font-serif text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-annora-heading sm:text-5xl lg:text-6xl"
            >
              {displayName ? `${displayName}, here is your sky` : "Here is your birth chart"}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-annora-muted sm:text-lg sm:leading-8">
              {bigThreeSummary(chart)}
            </p>

            <div className="mt-7 grid gap-3 text-sm text-[#5f535b] sm:grid-cols-2">
              <span className="flex items-center gap-2 rounded-xl border border-[#dfd3d9] bg-white/75 px-4 py-3">
                <Clock3 className="size-4 shrink-0 text-annora-mauve" aria-hidden="true" />
                <span>
                  {formattedDate}
                  {chart.details.unknownTime ? " · time unknown" : ` · ${chart.details.birthTime}`}
                </span>
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-[#dfd3d9] bg-white/75 px-4 py-3">
                <MapPin className="size-4 shrink-0 text-annora-mauve" aria-hidden="true" />
                <span className="line-clamp-2">{chart.details.location.label}</span>
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AnnoraButton type="button" onClick={saveChart}>
                {saved ? <Check className="size-4" /> : <Bookmark className="size-4" />}
                {saved ? "Saved to this device" : "Save this chart"}
              </AnnoraButton>
              <AnnoraButton tone="outline" asChild>
                <Link href="/chart">
                  View full birth chart
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </AnnoraButton>
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#857780]">
              <LockKeyhole className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Your birth details stay in this browser. No account is required.
            </p>
          </div>

          <AnnoraCard className="rounded-[2rem] bg-white/80 p-4 shadow-annora-card backdrop-blur sm:p-7">
            <ChartWheel chart={chart} />
          </AnnoraCard>
        </div>

        {chart.timeNotice && (
          <Alert className="mt-8 flex gap-3 rounded-2xl border-[#d7c3b6] bg-[#f7ede5] text-[#6c5142] [&>svg]:static [&>svg+div]:translate-y-0 [&>svg~*]:pl-0">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <AlertDescription className="leading-6">{chart.timeNotice}</AlertDescription>
          </Alert>
        )}

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <AnnoraCard className="rounded-[2rem] bg-white/80 p-5 shadow-annora-card sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-annora-mauve">
              Your foundations
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {foundations.map((placement) =>
                placement ? (
                  <article
                    key={placement.name}
                    className="rounded-2xl border border-[#e2d6dc] bg-[#fffdfb] p-4"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a7b84]">
                      {placement.name}
                    </p>
                    <h3 className="mt-1.5 font-serif text-xl text-annora-heading">
                      {placement.sign.symbol} {placement.sign.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-semibold text-annora-plum-muted">
                      {formatPlacement(placement)}
                    </p>
                    <p className="mt-3 line-clamp-4 text-xs leading-5 text-annora-muted">
                      {"key" in placement
                        ? placementInterpretation(placement)
                        : angleInterpretation(placement)}
                    </p>
                  </article>
                ) : null,
              )}
            </div>
          </AnnoraCard>

          <div className="rounded-[2rem] border border-white/10 bg-[#302630] p-5 text-white shadow-[0_24px_70px_rgba(40,25,37,.18)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d5b7cb]">
                  <Orbit className="size-4" aria-hidden="true" />
                  Active now
                </p>
                <h3 className="mt-2 font-serif text-2xl">Current transits</h3>
              </div>
              <RefreshCw className="mt-1 size-4 text-[#bfaebb]" aria-hidden="true" />
            </div>

            <div className="mt-5 space-y-3">
              {transits.aspects.length > 0 ? (
                transits.aspects.slice(0, 3).map((transit, index) => (
                  <article
                    key={`${transit.transitPlanet.key}-${transit.natalPlanet.key}-${transit.name}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.14em]">
                      <span className="font-semibold text-[#d5a87d]">
                        {index === 0 ? "Strongest now" : transit.strengthLabel}
                      </span>
                      <span className="text-[#bfaebb]">{transit.orb.toFixed(1)}° orb</span>
                    </div>
                    <h4 className="mt-1.5 font-serif text-base text-white">{transit.title}</h4>
                  </article>
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-[#d7cdd3]">
                  No close major transit is active right now. This section changes as the sky moves.
                </p>
              )}
            </div>

            <AnnoraButton asChild tone="light" className="mt-5 w-full">
              <Link href="/chart">
                Read the complete chart
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </AnnoraButton>
          </div>
        </div>
      </div>
    </section>
  );
}
