import { Orbit, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ZODIAC_SIGNS } from "@/lib/astrology/constants";
import type {
  BirthChart,
  PlanetKey,
  PlanetPlacement,
} from "@/lib/astrology/types";

import { AnnoraCard } from "./annora-ui";
import ChartWheel from "./chart-wheel";

function samplePlacement(
  key: PlanetKey,
  name: string,
  symbol: string,
  longitude: number,
): PlanetPlacement {
  const signIndex = Math.floor(longitude / 30) % 12;
  const degree = Math.floor(longitude % 30);

  return {
    key,
    name,
    symbol,
    longitude,
    signIndex,
    sign: ZODIAC_SIGNS[signIndex],
    degree,
    minute: 0,
    retrograde: false,
    house: signIndex + 1,
  };
}

export const SAMPLE_CHART: BirthChart = {
  id: "annora-example-chart",
  details: {
    name: "Annora",
    birthDate: "1992-10-10",
    birthTime: "09:42",
    unknownTime: false,
    location: {
      id: "example-new-york",
      name: "New York",
      label: "New York, New York, United States",
      country: "United States",
      countryCode: "US",
      latitude: 40.7128,
      longitude: -74.006,
      timezone: "America/New_York",
    },
  },
  calculatedAt: "2026-08-31T00:00:00.000Z",
  birthInstantUtc: "1992-10-10T13:42:00.000Z",
  system: "Western Tropical",
  houseSystem: "Whole Sign",
  placements: [
    samplePlacement("sun", "Sun", "☉", 197),
    samplePlacement("moon", "Moon", "☽", 43),
    samplePlacement("mercury", "Mercury", "☿", 211),
    samplePlacement("venus", "Venus", "♀", 166),
    samplePlacement("mars", "Mars", "♂", 286),
    samplePlacement("jupiter", "Jupiter", "♃", 76),
    samplePlacement("saturn", "Saturn", "♄", 331),
    samplePlacement("uranus", "Uranus", "♅", 49),
    samplePlacement("neptune", "Neptune", "♆", 357),
    samplePlacement("pluto", "Pluto", "♇", 302),
  ],
  ascendant: {
    name: "Ascendant",
    symbol: "ASC",
    longitude: 311,
    signIndex: 10,
    sign: ZODIAC_SIGNS[10],
    degree: 11,
    minute: 0,
  },
  midheaven: {
    name: "Midheaven",
    symbol: "MC",
    longitude: 233,
    signIndex: 7,
    sign: ZODIAC_SIGNS[7],
    degree: 23,
    minute: 0,
  },
  aspects: [],
};

const BIG_THREE = [
  ["Sun", "Libra", "Core self"],
  ["Moon", "Taurus", "Inner world"],
  ["Rising", "Aquarius", "How you meet life"],
] as const;

export default function HeroChartPreview() {
  return (
    <AnnoraCard className="relative overflow-hidden border-[#d7c7d1] bg-white/88 p-5 shadow-annora-card sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(198,151,184,.22),transparent_66%)]"
      />

      <div className="relative mb-5 flex items-start justify-between gap-4 text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-annora-bronze">
            Example birth chart
          </p>
          <h2 className="mt-1 font-serif text-2xl text-annora-ink">
            Your chart, in motion
          </h2>
        </div>
        <Badge className="rounded-full bg-annora-blush px-3 py-1 text-annora-plum-muted hover:bg-annora-blush">
          <Sparkles className="size-3" aria-hidden="true" />
          Live preview
        </Badge>
      </div>

      <div className="relative mx-auto max-w-[27rem]">
        <ChartWheel chart={SAMPLE_CHART} />
      </div>

      <div className="relative mt-5 grid gap-2 sm:grid-cols-3">
        {BIG_THREE.map(([label, sign, meaning]) => (
          <div
            key={label}
            className="rounded-xl border border-[#e4d9df] bg-[#fffdfb]/90 px-3 py-3 text-left"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a6a51]">
              {label}
            </p>
            <p className="mt-1 font-serif text-lg text-[#3a2d38]">{sign}</p>
            <p className="mt-0.5 text-[11px] text-[#897b83]">{meaning}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-3 flex items-start gap-3 rounded-xl bg-[#f2e8ed] px-4 py-3 text-left">
        <Orbit className="mt-0.5 size-4 shrink-0 text-annora-plum-muted" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-[#553a4d]">Current transit highlights</p>
          <p className="mt-0.5 text-xs leading-5 text-[#76666f]">
            See which movements in today&apos;s sky connect most closely with your natal chart.
          </p>
        </div>
      </div>
    </AnnoraCard>
  );
}
