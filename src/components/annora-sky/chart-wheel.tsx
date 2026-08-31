import { ZODIAC_SIGNS } from "@/lib/astrology/constants";
import type { BirthChart } from "@/lib/astrology/types";

function pointOnCircle(longitude: number, radius: number) {
  const radians = ((longitude - 90) * Math.PI) / 180;
  return {
    left: `${50 + Math.cos(radians) * radius}%`,
    top: `${50 + Math.sin(radians) * radius}%`,
  };
}

export default function ChartWheel({ chart }: { chart: BirthChart }) {
  return (
    <div className="mx-auto w-full max-w-[34rem]">
      <div
        className="relative aspect-square rounded-full border border-[#a98b9e] bg-[#fbf6f2] shadow-[0_22px_65px_rgba(69,44,62,0.16)]"
        aria-label="Birth chart wheel showing zodiac signs and planetary placements"
      >
        <div
          className="absolute inset-[3.5%] rounded-full border border-[#bda5b4]"
          style={{
            background:
              "repeating-conic-gradient(from -15deg, transparent 0deg 29.5deg, rgba(93,60,85,.24) 29.5deg 30deg)",
          }}
        />
        <div className="absolute inset-[18%] rounded-full border border-[#bda5b4]/80 bg-[#fffdfb]" />
        <div className="absolute inset-[36%] grid place-items-center rounded-full border border-[#b69cab] bg-[#5d3c55] text-center text-white shadow-inner">
          <span>
            <span className="block font-serif text-lg sm:text-xl">AS</span>
            <span className="hidden text-[9px] uppercase tracking-[0.18em] text-[#e2cfda] sm:block">
              Tropical
            </span>
          </span>
        </div>

        {ZODIAC_SIGNS.map((sign, index) => (
          <span
            key={sign.name}
            className="absolute z-10 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fbf6f2]/90 text-base text-[#6d465f] sm:size-9 sm:text-xl"
            style={pointOnCircle(index * 30 + 15, 43)}
            title={sign.name}
            aria-label={sign.name}
          >
            {sign.symbol}
          </span>
        ))}

        {chart.placements.map((placement, index) => (
          <span
            key={placement.key}
            className="absolute z-20 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#d4c2cc] bg-white text-sm text-[#4f3548] shadow-sm sm:size-8 sm:text-base"
            style={pointOnCircle(placement.longitude, index % 2 === 0 ? 29 : 33)}
            title={`${placement.name} in ${placement.sign.name}`}
            aria-label={`${placement.name} in ${placement.sign.name}`}
          >
            {placement.symbol}
          </span>
        ))}

        {chart.ascendant && (
          <span
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9a6a51] px-2 py-1 text-[9px] font-bold tracking-[0.08em] text-white shadow sm:text-[10px]"
            style={pointOnCircle(chart.ascendant.longitude, 37)}
            title={`Ascendant in ${chart.ascendant.sign.name}`}
          >
            ASC
          </span>
        )}
      </div>
      <p className="mt-4 text-center text-xs leading-5 text-[#857780]">
        Tropical zodiac · {chart.houseSystem} houses
        {chart.details.unknownTime ? " · Houses hidden without an exact birth time" : ""}
      </p>
    </div>
  );
}

