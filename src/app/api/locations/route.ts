import { NextRequest, NextResponse } from "next/server";

type OpenMeteoResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  population?: number;
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  if (query.length > 80) {
    return NextResponse.json(
      { error: "Please use a shorter place name." },
      { status: 400 }
    );
  }

  const baseUrl =
    process.env.GEOCODING_API_BASE_URL ||
    "https://geocoding-api.open-meteo.com/v1";
  const apiKey = process.env.OPEN_METEO_API_KEY;
  const params = new URLSearchParams({
    name: query,
    count: "8",
    language: "en",
    format: "json",
  });

  if (apiKey) params.set("apikey", apiKey);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/search?${params}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      throw new Error(`Location provider returned ${response.status}`);
    }

    const payload = (await response.json()) as { results?: OpenMeteoResult[] };
    const results = (payload.results || [])
      .filter((place) => place.timezone)
      .sort((first, second) => (second.population || 0) - (first.population || 0))
      .map((place) => {
        const parts = [place.name, place.admin1, place.country].filter(Boolean);
        return {
          id: String(place.id),
          name: place.name,
          label: parts.join(", "),
          country: place.country || "",
          countryCode: place.country_code || "",
          admin1: place.admin1 || undefined,
          latitude: place.latitude,
          longitude: place.longitude,
          timezone: place.timezone as string,
        };
      });

    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      }
    );
  } catch (error) {
    console.error("Location search failed", error);
    return NextResponse.json(
      {
        error:
          "Place search is temporarily unavailable. Please wait a moment and try again.",
      },
      { status: 502 }
    );
  }
}

