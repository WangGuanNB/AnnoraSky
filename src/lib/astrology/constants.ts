import { Body } from "astronomy-engine";

import type { PlanetKey, ZodiacSign } from "./types";

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: "Aries",
    symbol: "♈",
    element: "Fire",
    mode: "Cardinal",
    summary: "direct, initiating, and energized by a clear challenge",
  },
  {
    name: "Taurus",
    symbol: "♉",
    element: "Earth",
    mode: "Fixed",
    summary: "steady, sensory, and motivated to build what will last",
  },
  {
    name: "Gemini",
    symbol: "♊",
    element: "Air",
    mode: "Mutable",
    summary: "curious, adaptable, and energized by ideas and exchange",
  },
  {
    name: "Cancer",
    symbol: "♋",
    element: "Water",
    mode: "Cardinal",
    summary: "protective, intuitive, and responsive to emotional atmosphere",
  },
  {
    name: "Leo",
    symbol: "♌",
    element: "Fire",
    mode: "Fixed",
    summary: "expressive, loyal, and drawn toward wholehearted participation",
  },
  {
    name: "Virgo",
    symbol: "♍",
    element: "Earth",
    mode: "Mutable",
    summary: "observant, practical, and attentive to what can be improved",
  },
  {
    name: "Libra",
    symbol: "♎",
    element: "Air",
    mode: "Cardinal",
    summary: "relational, discerning, and alert to balance and reciprocity",
  },
  {
    name: "Scorpio",
    symbol: "♏",
    element: "Water",
    mode: "Fixed",
    summary: "private, intense, and willing to go beneath the surface",
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    element: "Fire",
    mode: "Mutable",
    summary: "exploratory, candid, and oriented toward meaning and possibility",
  },
  {
    name: "Capricorn",
    symbol: "♑",
    element: "Earth",
    mode: "Cardinal",
    summary: "purposeful, self-directed, and prepared to work toward mastery",
  },
  {
    name: "Aquarius",
    symbol: "♒",
    element: "Air",
    mode: "Fixed",
    summary: "independent, future-minded, and interested in the wider system",
  },
  {
    name: "Pisces",
    symbol: "♓",
    element: "Water",
    mode: "Mutable",
    summary: "imaginative, receptive, and sensitive to subtle connections",
  },
];

export const PLANETS: Array<{
  key: PlanetKey;
  name: string;
  symbol: string;
  body: Body;
  role: string;
}> = [
  { key: "sun", name: "Sun", symbol: "☉", body: Body.Sun, role: "identity and direction" },
  { key: "moon", name: "Moon", symbol: "☽", body: Body.Moon, role: "instincts and emotional needs" },
  { key: "mercury", name: "Mercury", symbol: "☿", body: Body.Mercury, role: "thinking and communication" },
  { key: "venus", name: "Venus", symbol: "♀", body: Body.Venus, role: "relating, values, and attraction" },
  { key: "mars", name: "Mars", symbol: "♂", body: Body.Mars, role: "drive, assertion, and action" },
  { key: "jupiter", name: "Jupiter", symbol: "♃", body: Body.Jupiter, role: "growth, confidence, and perspective" },
  { key: "saturn", name: "Saturn", symbol: "♄", body: Body.Saturn, role: "structure, limits, and responsibility" },
  { key: "uranus", name: "Uranus", symbol: "♅", body: Body.Uranus, role: "change, freedom, and disruption" },
  { key: "neptune", name: "Neptune", symbol: "♆", body: Body.Neptune, role: "imagination, ideals, and sensitivity" },
  { key: "pluto", name: "Pluto", symbol: "♇", body: Body.Pluto, role: "power, depth, and transformation" },
];

export const ASPECTS = [
  { name: "Conjunction", symbol: "☌", angle: 0, natalOrb: 8, transitOrb: 2.5 },
  { name: "Sextile", symbol: "⚹", angle: 60, natalOrb: 4, transitOrb: 1.5 },
  { name: "Square", symbol: "□", angle: 90, natalOrb: 6, transitOrb: 2.25 },
  { name: "Trine", symbol: "△", angle: 120, natalOrb: 6, transitOrb: 2.25 },
  { name: "Opposition", symbol: "☍", angle: 180, natalOrb: 8, transitOrb: 2.5 },
] as const;

export const PENDING_CHART_KEY = "annora:pending-chart";
export const SAVED_CHARTS_KEY = "annora:saved-charts";

