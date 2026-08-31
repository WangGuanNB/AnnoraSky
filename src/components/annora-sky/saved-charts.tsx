"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  MapPin,
  Trash2,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import {
  deleteSavedChart,
  getSavedCharts,
  setPendingChart,
} from "@/lib/astrology/storage";
import type { SavedChart } from "@/lib/astrology/types";

import { AnnoraButton, AnnoraCard } from "./annora-ui";

export default function SavedCharts() {
  const router = useRouter();
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCharts(getSavedCharts());
    setReady(true);
  }, []);

  function openChart(chart: SavedChart) {
    setPendingChart(chart.details);
    router.push("/chart");
  }

  function removeChart(chart: SavedChart) {
    const label = chart.details.name || chart.details.location.name;
    if (!window.confirm(`Remove ${label}'s chart from this device?`)) return;
    setCharts(deleteSavedChart(chart.id));
  }

  return (
    <section className="min-h-[72vh] bg-annora-page px-4 pb-24 pt-32 sm:px-6 md:pt-40">
      <div className="mx-auto max-w-5xl">
        <AnnoraButton tone="text" asChild className="text-sm">
          <Link href="/#birth-chart">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to the calculator
          </Link>
        </AnnoraButton>

        <div className="mt-8 max-w-3xl">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b5c7e]">
            <Bookmark className="size-4" aria-hidden="true" />
            Private to this device
          </p>
          <h1 className="mt-5 font-serif text-5xl tracking-[-0.04em] text-annora-heading sm:text-6xl">
            Saved charts
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#71656c]">
            Open a saved profile to recalculate the birth chart and refresh its current transits. These details are stored only in this browser.
          </p>
        </div>

        {!ready ? (
          <p className="mt-12 text-sm text-[#7d7078]">Loading saved charts…</p>
        ) : charts.length === 0 ? (
          <AnnoraCard className="mt-12 rounded-[2rem] border-dashed border-[#cdbbc5] bg-white/65 p-8 text-center sm:p-12">
            <Bookmark className="mx-auto size-7 text-[#8b5c7e]" aria-hidden="true" />
            <h2 className="mt-5 font-serif text-3xl text-[#352b34]">No saved charts yet</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#74676f]">
              Create a chart, then choose “Save this chart” on the result page. No account is required.
            </p>
            <AnnoraButton asChild className="mx-auto mt-7 w-fit">
              <Link href="/#birth-chart">
                Create a birth chart
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </AnnoraButton>
          </AnnoraCard>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {charts.map((chart) => {
              const displayName = chart.details.name || "Unnamed chart";
              const date = new Intl.DateTimeFormat("en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(`${chart.details.birthDate}T12:00:00`));

              return (
                <AnnoraCard key={chart.id} className="rounded-[1.6rem] bg-white p-6 shadow-annora-panel">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a6a51]">Birth chart</p>
                      <h2 className="mt-2 font-serif text-2xl text-[#352b34]">{displayName}</h2>
                    </div>
                    <AnnoraButton
                      type="button"
                      tone="dangerIcon"
                      onClick={() => removeChart(chart)}
                      aria-label={`Remove ${displayName}'s chart`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </AnnoraButton>
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-[#71656c]">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-[#8b5c7e]" aria-hidden="true" />
                      {date}
                      {chart.details.unknownTime ? " · time unknown" : ` · ${chart.details.birthTime}`}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-[#8b5c7e]" aria-hidden="true" />
                      {chart.details.location.label}
                    </p>
                  </div>

                  <AnnoraButton
                    type="button"
                    onClick={() => openChart(chart)}
                    className="mt-6 h-11 w-full text-sm"
                  >
                    Open chart and refresh transits
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </AnnoraButton>
                </AnnoraCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
