import { Ecliptic, GeoVector, SiderealTime } from "astronomy-engine";
import { DateTime } from "luxon";

import { ASPECTS, PLANETS, ZODIAC_SIGNS } from "./constants";
import type {
  AspectName,
  BirthChart,
  BirthDetails,
  ChartAngle,
  NatalAspect,
  PlanetPlacement,
  TransitAspect,
  TransitSnapshot,
} from "./types";

const DAY_MS = 86_400_000;

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}

function signedDegrees(value: number) {
  const normalized = normalizeDegrees(value);
  return normalized > 180 ? normalized - 360 : normalized;
}

function angularDistance(first: number, second: number) {
  return Math.abs(signedDegrees(first - second));
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function obliquityOfDate(date: Date) {
  const julianDay = date.getTime() / DAY_MS + 2_440_587.5;
  const centuries = (julianDay - 2_451_545) / 36_525;
  const arcSeconds =
    84_381.448 -
    46.815 * centuries -
    0.00059 * centuries * centuries +
    0.001813 * centuries * centuries * centuries;
  return arcSeconds / 3_600;
}

function eclipticPointAtHorizon(
  longitude: number,
  localSiderealDegrees: number,
  latitude: number,
  obliquity: number
) {
  const lambda = degreesToRadians(longitude);
  const epsilon = degreesToRadians(obliquity);
  const phi = degreesToRadians(latitude);
  const rightAscension = Math.atan2(
    Math.sin(lambda) * Math.cos(epsilon),
    Math.cos(lambda)
  );
  const declination = Math.asin(Math.sin(lambda) * Math.sin(epsilon));
  const hourAngle = degreesToRadians(
    signedDegrees(localSiderealDegrees - radiansToDegrees(rightAscension))
  );
  const altitude = Math.asin(
    Math.sin(phi) * Math.sin(declination) +
      Math.cos(phi) * Math.cos(declination) * Math.cos(hourAngle)
  );

  return {
    altitude,
    hourAngle: signedDegrees(radiansToDegrees(hourAngle)),
  };
}

function calculateAscendant(date: Date, latitude: number, longitude: number) {
  const localSiderealDegrees = normalizeDegrees(SiderealTime(date) * 15 + longitude);
  const obliquity = obliquityOfDate(date);
  const roots: Array<{ longitude: number; hourAngle: number }> = [];
  const step = 1;

  for (let start = 0; start < 360; start += step) {
    const end = start + step;
    const startPoint = eclipticPointAtHorizon(
      start,
      localSiderealDegrees,
      latitude,
      obliquity
    );
    const endPoint = eclipticPointAtHorizon(
      normalizeDegrees(end),
      localSiderealDegrees,
      latitude,
      obliquity
    );

    if (startPoint.altitude === 0 || startPoint.altitude * endPoint.altitude <= 0) {
      let low = start;
      let high = end;
      let lowAltitude = startPoint.altitude;

      for (let iteration = 0; iteration < 40; iteration += 1) {
        const midpoint = (low + high) / 2;
        const midpointAltitude = eclipticPointAtHorizon(
          normalizeDegrees(midpoint),
          localSiderealDegrees,
          latitude,
          obliquity
        ).altitude;

        if (lowAltitude * midpointAltitude <= 0) {
          high = midpoint;
        } else {
          low = midpoint;
          lowAltitude = midpointAltitude;
        }
      }

      const rootLongitude = normalizeDegrees((low + high) / 2);
      const rootPoint = eclipticPointAtHorizon(
        rootLongitude,
        localSiderealDegrees,
        latitude,
        obliquity
      );

      if (!roots.some((root) => angularDistance(root.longitude, rootLongitude) < 0.1)) {
        roots.push({ longitude: rootLongitude, hourAngle: rootPoint.hourAngle });
      }
    }
  }

  const risingRoot = roots.find(
    (root) => root.hourAngle < -0.0001 && root.hourAngle > -179.9999
  );

  if (!risingRoot) {
    throw new Error("Unable to calculate the Ascendant for this location and time.");
  }

  return risingRoot.longitude;
}

function calculateMidheaven(date: Date, longitude: number) {
  const localSidereal = degreesToRadians(
    normalizeDegrees(SiderealTime(date) * 15 + longitude)
  );
  const obliquity = degreesToRadians(obliquityOfDate(date));
  return normalizeDegrees(
    radiansToDegrees(
      Math.atan2(Math.sin(localSidereal) / Math.cos(obliquity), Math.cos(localSidereal))
    )
  );
}

function anglePlacement(
  name: ChartAngle["name"],
  symbol: ChartAngle["symbol"],
  longitude: number
): ChartAngle {
  const normalized = normalizeDegrees(longitude);
  const signIndex = Math.floor(normalized / 30);
  const decimalDegree = normalized - signIndex * 30;
  const degree = Math.floor(decimalDegree);
  const minute = Math.round((decimalDegree - degree) * 60);

  return {
    name,
    symbol,
    longitude: normalized,
    signIndex,
    sign: ZODIAC_SIGNS[signIndex],
    degree: minute === 60 ? degree + 1 : degree,
    minute: minute === 60 ? 0 : minute,
  };
}

function geocentricLongitude(body: (typeof PLANETS)[number]["body"], date: Date) {
  return normalizeDegrees(Ecliptic(GeoVector(body, date, true)).elon);
}

function isRetrograde(body: (typeof PLANETS)[number]["body"], date: Date) {
  const before = geocentricLongitude(body, new Date(date.getTime() - DAY_MS / 2));
  const after = geocentricLongitude(body, new Date(date.getTime() + DAY_MS / 2));
  return signedDegrees(after - before) < 0;
}

function planetPlacements(date: Date, ascendantSignIndex?: number): PlanetPlacement[] {
  return PLANETS.map((planet) => {
    const longitude = geocentricLongitude(planet.body, date);
    const signIndex = Math.floor(longitude / 30);
    const decimalDegree = longitude - signIndex * 30;
    const degree = Math.floor(decimalDegree);
    const minute = Math.round((decimalDegree - degree) * 60);

    return {
      key: planet.key,
      name: planet.name,
      symbol: planet.symbol,
      longitude,
      signIndex,
      sign: ZODIAC_SIGNS[signIndex],
      degree: minute === 60 ? degree + 1 : degree,
      minute: minute === 60 ? 0 : minute,
      retrograde:
        planet.key === "sun" || planet.key === "moon"
          ? false
          : isRetrograde(planet.body, date),
      house:
        ascendantSignIndex === undefined
          ? undefined
          : ((signIndex - ascendantSignIndex + 12) % 12) + 1,
    };
  });
}

function natalAspects(placements: PlanetPlacement[]): NatalAspect[] {
  const results: NatalAspect[] = [];

  for (let firstIndex = 0; firstIndex < placements.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < placements.length; secondIndex += 1) {
      const bodyA = placements[firstIndex];
      const bodyB = placements[secondIndex];
      const separation = angularDistance(bodyA.longitude, bodyB.longitude);

      const match = ASPECTS.map((aspect) => ({
        ...aspect,
        orb: Math.abs(separation - aspect.angle),
      }))
        .filter((aspect) => {
          const luminaryBonus =
            bodyA.key === "sun" ||
            bodyA.key === "moon" ||
            bodyB.key === "sun" ||
            bodyB.key === "moon"
              ? 1
              : 0;
          return aspect.orb <= aspect.natalOrb + luminaryBonus;
        })
        .sort((first, second) => first.orb - second.orb)[0];

      if (match) {
        results.push({
          bodyA,
          bodyB,
          name: match.name as AspectName,
          symbol: match.symbol,
          angle: match.angle,
          orb: match.orb,
        });
      }
    }
  }

  return results.sort((first, second) => first.orb - second.orb);
}

function createChartId(details: BirthDetails) {
  const source = `${details.birthDate}-${details.birthTime || "unknown"}-${details.location.id}`;
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }
  return `chart-${hash.toString(36)}`;
}

export function calculateBirthChart(details: BirthDetails): BirthChart {
  const localTime = details.unknownTime ? "12:00" : details.birthTime;

  if (!localTime) {
    throw new Error("An exact birth time is required unless unknown time is selected.");
  }

  const localDateTime = DateTime.fromISO(`${details.birthDate}T${localTime}`, {
    zone: details.location.timezone,
    setZone: true,
  });

  if (!localDateTime.isValid) {
    throw new Error(localDateTime.invalidExplanation || "The birth date or time is not valid.");
  }

  const birthDate = localDateTime.toUTC().toJSDate();
  let ascendant: ChartAngle | undefined;
  let midheaven: ChartAngle | undefined;

  if (!details.unknownTime) {
    ascendant = anglePlacement(
      "Ascendant",
      "ASC",
      calculateAscendant(
        birthDate,
        details.location.latitude,
        details.location.longitude
      )
    );
    midheaven = anglePlacement(
      "Midheaven",
      "MC",
      calculateMidheaven(birthDate, details.location.longitude)
    );
  }

  const placements = planetPlacements(birthDate, ascendant?.signIndex);

  return {
    id: createChartId(details),
    details,
    calculatedAt: new Date().toISOString(),
    birthInstantUtc: birthDate.toISOString(),
    system: "Western Tropical",
    houseSystem: "Whole Sign",
    placements,
    ascendant,
    midheaven,
    aspects: natalAspects(placements),
    timeNotice: details.unknownTime
      ? "Planetary positions use 12:00 PM in the birthplace time zone. Rising, Midheaven, and houses are hidden; the Moon may change sign on this date."
      : undefined,
  };
}

const planetWeight: Record<string, number> = {
  pluto: 0,
  neptune: 0.25,
  uranus: 0.5,
  saturn: 0.75,
  jupiter: 1,
  mars: 1.5,
  venus: 2,
  mercury: 2,
  sun: 2.25,
  moon: 3,
};

function transitInterpretation(
  transitPlanet: PlanetPlacement,
  natalPlanet: PlanetPlacement,
  aspectName: AspectName
) {
  const transitRole = PLANETS.find((planet) => planet.key === transitPlanet.key)?.role;
  const natalRole = PLANETS.find((planet) => planet.key === natalPlanet.key)?.role;
  const tone: Record<AspectName, string> = {
    Conjunction: "brings concentrated attention to",
    Sextile: "opens a practical opportunity around",
    Square: "creates useful friction around",
    Trine: "supports a more natural flow around",
    Opposition: "asks for balance and perspective around",
  };

  return `${transitPlanet.name}, associated with ${transitRole}, ${tone[aspectName]} your ${natalPlanet.name} themes of ${natalRole}. Treat this as a prompt for reflection, not a fixed prediction.`;
}

export function calculateCurrentTransits(
  chart: BirthChart,
  currentDate = new Date()
): TransitSnapshot {
  const transitingPlacements = planetPlacements(currentDate);
  const candidates: Array<TransitAspect & { score: number }> = [];

  for (const transitPlanet of transitingPlacements) {
    for (const natalPlanet of chart.placements) {
      const separation = angularDistance(transitPlanet.longitude, natalPlanet.longitude);

      for (const aspect of ASPECTS) {
        const orb = Math.abs(separation - aspect.angle);
        if (orb <= aspect.transitOrb) {
          candidates.push({
            transitPlanet,
            natalPlanet,
            name: aspect.name as AspectName,
            symbol: aspect.symbol,
            orb,
            strengthLabel:
              orb < 0.5 ? "Exact now" : orb < 1 ? "Within 1°" : "Active",
            title: `${transitPlanet.name} ${aspect.name.toLowerCase()} your ${natalPlanet.name}`,
            interpretation: transitInterpretation(
              transitPlanet,
              natalPlanet,
              aspect.name as AspectName
            ),
            score:
              orb +
              (planetWeight[transitPlanet.key] ?? 2) +
              (natalPlanet.key === "sun" || natalPlanet.key === "moon" ? 0 : 0.5),
          });
        }
      }
    }
  }

  const aspects = candidates
    .sort((first, second) => first.score - second.score)
    .slice(0, 5)
    .map(({ score: _score, ...aspect }) => aspect);

  return {
    calculatedAt: currentDate.toISOString(),
    placements: transitingPlacements,
    aspects,
  };
}

export function formatPlacement(placement: PlanetPlacement | ChartAngle) {
  return `${placement.degree}°${String(placement.minute).padStart(2, "0")}′ ${placement.sign.name}`;
}

