import { PLANETS } from "./constants";
import type { BirthChart, ChartAngle, PlanetPlacement } from "./types";

const HOUSE_TOPICS = [
  "identity, embodiment, and how you begin",
  "resources, values, and self-support",
  "learning, language, and everyday exchange",
  "home, roots, and emotional foundations",
  "creativity, play, romance, and self-expression",
  "routines, craft, health, and useful contribution",
  "partnership, reciprocity, and one-to-one bonds",
  "trust, shared resources, intimacy, and renewal",
  "belief, travel, study, and wider perspective",
  "career, responsibility, and public direction",
  "friendship, community, and future aims",
  "rest, retreat, closure, and the inner life",
];

export function placementInterpretation(placement: PlanetPlacement) {
  const role = PLANETS.find((planet) => planet.key === placement.key)?.role;
  const houseSentence = placement.house
    ? ` In the ${ordinal(placement.house)} house, these themes are especially visible through ${HOUSE_TOPICS[placement.house - 1]}.`
    : "";

  return `${placement.name} describes ${role}. In ${placement.sign.name}, it tends to feel ${placement.sign.summary}.${houseSentence}`;
}

export function angleInterpretation(angle: ChartAngle) {
  if (angle.name === "Ascendant") {
    return `Your ${angle.sign.name} Rising describes the style you use to meet new situations. It can make your first response feel ${angle.sign.summary}.`;
  }

  return `Your ${angle.sign.name} Midheaven describes a visible direction of growth in work and public life. It tends to develop through a style that is ${angle.sign.summary}.`;
}

export function bigThreeSummary(chart: BirthChart) {
  const sun = chart.placements.find((placement) => placement.key === "sun");
  const moon = chart.placements.find((placement) => placement.key === "moon");

  if (!sun || !moon) {
    return "Your chart brings together identity, emotional needs, and the way you meet new experiences.";
  }

  if (!chart.ascendant) {
    return `Your ${sun.sign.name} Sun and ${moon.sign.name} Moon describe the relationship between your direction and emotional needs. Add an exact birth time later to reveal your Rising sign and houses.`;
  }

  return `Your ${sun.sign.name} Sun gives your chart its central direction, your ${moon.sign.name} Moon describes what restores you emotionally, and ${chart.ascendant.sign.name} Rising shapes the way you enter new situations.`;
}

function ordinal(value: number) {
  const remainder = value % 100;
  if (remainder >= 11 && remainder <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

