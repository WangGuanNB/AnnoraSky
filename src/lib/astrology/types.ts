export type LocationChoice = {
  id: string;
  name: string;
  label: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type BirthDetails = {
  name?: string;
  birthDate: string;
  birthTime?: string;
  unknownTime: boolean;
  location: LocationChoice;
};

export type PlanetKey =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

export type ZodiacSign = {
  name: string;
  symbol: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  mode: "Cardinal" | "Fixed" | "Mutable";
  summary: string;
};

export type PlanetPlacement = {
  key: PlanetKey;
  name: string;
  symbol: string;
  longitude: number;
  signIndex: number;
  sign: ZodiacSign;
  degree: number;
  minute: number;
  retrograde: boolean;
  house?: number;
};

export type ChartAngle = {
  name: "Ascendant" | "Midheaven";
  symbol: "ASC" | "MC";
  longitude: number;
  signIndex: number;
  sign: ZodiacSign;
  degree: number;
  minute: number;
};

export type AspectName =
  | "Conjunction"
  | "Sextile"
  | "Square"
  | "Trine"
  | "Opposition";

export type NatalAspect = {
  bodyA: PlanetPlacement;
  bodyB: PlanetPlacement;
  name: AspectName;
  symbol: string;
  angle: number;
  orb: number;
};

export type BirthChart = {
  id: string;
  details: BirthDetails;
  calculatedAt: string;
  birthInstantUtc: string;
  system: "Western Tropical";
  houseSystem: "Whole Sign";
  placements: PlanetPlacement[];
  ascendant?: ChartAngle;
  midheaven?: ChartAngle;
  aspects: NatalAspect[];
  timeNotice?: string;
};

export type TransitAspect = {
  transitPlanet: PlanetPlacement;
  natalPlanet: PlanetPlacement;
  name: AspectName;
  symbol: string;
  orb: number;
  strengthLabel: string;
  title: string;
  interpretation: string;
};

export type TransitSnapshot = {
  calculatedAt: string;
  placements: PlanetPlacement[];
  aspects: TransitAspect[];
};

export type SavedChart = {
  id: string;
  createdAt: string;
  updatedAt: string;
  details: BirthDetails;
};

