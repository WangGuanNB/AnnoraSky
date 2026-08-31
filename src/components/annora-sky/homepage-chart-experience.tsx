"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import type { Hero as HeroType } from "@/types/blocks/hero";
import type { BirthDetails } from "@/lib/astrology/types";
import Hero from "@/components/blocks/hero";

import BirthChartForm from "./birth-chart-form";
import HeroChartPreview from "./hero-chart-preview";

const InlineChartResult = dynamic(() => import("./inline-chart-result"), {
  ssr: false,
  loading: () => (
    <section
      id="your-chart"
      aria-label="Preparing your birth chart"
      className="border-y border-annora-border bg-annora-page px-4 py-16 sm:px-6 md:py-20"
    >
      <div className="mx-auto max-w-7xl animate-pulse rounded-[2rem] border border-annora-card-border bg-white/75 p-6 shadow-annora-card sm:p-10">
        <div className="h-3 w-36 rounded-full bg-[#eadde4]" />
        <div className="mt-5 h-10 max-w-xl rounded-xl bg-[#eadde4]" />
        <div className="mt-4 h-4 max-w-2xl rounded-full bg-[#f0e6eb]" />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="h-64 rounded-3xl bg-[#f3e9ee]" />
          <div className="mx-auto aspect-square w-full max-w-[28rem] rounded-full bg-[#f3e9ee]" />
        </div>
      </div>
    </section>
  ),
});

export default function HomepageChartExperience({ hero }: { hero: HeroType }) {
  const [details, setDetails] = useState<BirthDetails | null>(null);

  const showChart = useCallback((birthDetails: BirthDetails) => {
    setDetails(birthDetails);

    window.setTimeout(() => {
      document
        .getElementById("your-chart")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, []);

  return (
    <div id="birth-chart">
      <Hero hero={hero}>
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 pt-2 text-left lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <BirthChartForm onChartGenerated={showChart} />
          <HeroChartPreview />
        </div>
      </Hero>

      {details && <InlineChartResult key={JSON.stringify(details)} details={details} />}
    </div>
  );
}
