"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  LoaderCircle,
  LockKeyhole,
  MapPin,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { setPendingChart } from "@/lib/astrology/storage";
import type { BirthDetails, LocationChoice } from "@/lib/astrology/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { AnnoraButton, AnnoraEyebrow, AnnoraInput } from "./annora-ui";

export default function BirthChartForm({
  onChartGenerated,
}: {
  onChartGenerated?: (details: BirthDetails) => void;
}) {
  const router = useRouter();
  const [unknownTime, setUnknownTime] = useState(false);
  const [placeQuery, setPlaceQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationChoice | null>(null);
  const [locations, setLocations] = useState<LocationChoice[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedLocation?.label === placeQuery || placeQuery.trim().length < 2) {
      setLocations([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setError("");

      try {
        const response = await fetch(`/api/locations?q=${encodeURIComponent(placeQuery.trim())}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as {
          results?: LocationChoice[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Place search is unavailable.");
        }

        setLocations(payload.results || []);
      } catch (searchError) {
        if ((searchError as Error).name !== "AbortError") {
          setLocations([]);
          setError((searchError as Error).message);
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [placeQuery, selectedLocation]);

  function chooseLocation(location: LocationChoice) {
    setSelectedLocation(location);
    setPlaceQuery(location.label);
    setLocations([]);
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedLocation) {
      setError("Choose a birthplace from the search results so we can use the correct time zone.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const birthDetails: BirthDetails = {
      name: String(form.get("name") || "").trim() || undefined,
      birthDate: String(form.get("birthDate") || ""),
      birthTime: unknownTime ? undefined : String(form.get("birthTime") || ""),
      unknownTime,
      location: selectedLocation,
    };

    try {
      setIsSubmitting(true);
      setPendingChart(birthDetails);
      if (onChartGenerated) {
        onChartGenerated(birthDetails);
        setIsSubmitting(false);
      } else {
        router.push("/chart");
      }
    } catch {
      setIsSubmitting(false);
      setError("This browser could not prepare your chart. Please check privacy settings and try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] border border-annora-border bg-white/90 p-5 shadow-annora-card backdrop-blur md:p-6"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-annora-mauve">
            Start your chart
          </p>
          <h2 className="mt-1.5 font-serif text-xl text-annora-ink sm:text-2xl">
            Enter your birth details
          </h2>
        </div>
        <AnnoraEyebrow className="border-transparent bg-[#f4ecef] px-3 py-1 font-medium normal-case tracking-normal text-annora-plum-muted">
          No signup
        </AnnoraEyebrow>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <Label className="grid gap-2 text-sm font-medium text-[#3a303b]">
          Birth date
          <AnnoraInput
            required
            name="birthDate"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
          />
        </Label>

        <Label className="grid gap-2 text-sm font-medium text-[#3a303b]">
          Birth time
          <AnnoraInput
            required={!unknownTime}
            disabled={unknownTime}
            name="birthTime"
            type="time"
            className="disabled:opacity-45"
          />
        </Label>

        <div className="relative grid gap-2 text-sm font-medium text-[#3a303b] sm:col-span-2">
          <Label htmlFor="birth-place">Birthplace</Label>
          <div className="relative">
            <MapPin
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8b7b84]"
              aria-hidden="true"
            />
            <AnnoraInput
              id="birth-place"
              required
              value={placeQuery}
              onChange={(event) => {
                setPlaceQuery(event.target.value);
                setSelectedLocation(null);
              }}
              autoComplete="off"
              placeholder="Start typing a city"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={locations.length > 0}
              aria-controls="birthplace-results"
              className="pl-11 pr-11"
            />
            {isSearching && (
              <LoaderCircle
                className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-[#8b5c7e]"
                aria-label="Searching places"
              />
            )}
            {selectedLocation && !isSearching && (
              <Check
                className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#607c65]"
                aria-label="Place selected"
              />
            )}
          </div>

          {locations.length > 0 && (
            <ul
              id="birthplace-results"
              role="listbox"
              className="absolute left-0 right-0 top-[5.35rem] z-30 max-h-64 overflow-y-auto rounded-xl border border-[#d9c9d3] bg-white p-1.5 shadow-[0_18px_45px_rgba(65,42,59,0.18)]"
            >
              {locations.map((location) => (
                <li key={location.id} role="option" aria-selected="false">
                  <AnnoraButton
                    type="button"
                    tone="text"
                    onClick={() => chooseLocation(location)}
                    className="h-auto w-full items-start justify-start rounded-lg px-3 py-2.5 text-left font-medium text-[#352b34] hover:bg-[#f6eef2] hover:text-[#352b34] focus-visible:bg-[#f6eef2]"
                  >
                    <MapPin className="mt-0.5 size-4 shrink-0 text-[#8b5c7e]" aria-hidden="true" />
                    <span>
                      <span className="block font-medium text-[#352b34]">{location.label}</span>
                      <span className="mt-0.5 block text-xs font-normal text-[#82747d]">
                        {location.timezone}
                      </span>
                    </span>
                  </AnnoraButton>
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>

      <div className="mt-3.5 flex items-center gap-3">
        <Checkbox
          id="unknown-birth-time"
          checked={unknownTime}
          onCheckedChange={(checked) => setUnknownTime(checked === true)}
          className="border-[#bda9b6] focus-visible:ring-annora-mauve/30"
        />
        <Label htmlFor="unknown-birth-time" className="cursor-pointer font-normal text-[#645961]">
          I don&apos;t know my exact birth time
        </Label>
      </div>

      <AnnoraButton
        type="submit"
        disabled={isSubmitting}
        className="mt-4 h-13 w-full disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Preparing your chart
          </>
        ) : (
          <>
            Create my free chart
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </AnnoraButton>

      <div className="mt-3 flex flex-col items-center justify-center gap-2 text-center text-xs text-[#7d7078] sm:flex-row sm:gap-3">
        <span className="flex items-center gap-2">
          <LockKeyhole className="size-3.5" aria-hidden="true" />
          Your chart is calculated and stored in this browser.
        </span>
        <span className="hidden text-[#c4b7be] sm:inline">•</span>
        <Link href="/saved-charts" className="font-semibold text-[#6d465f] underline-offset-4 hover:underline">
          View saved charts
        </Link>
      </div>

      {error && (
        <Alert className="mt-4 rounded-xl border-[#d9bbb9] bg-[#fbefed] text-[#744542]">
          <AlertDescription className="leading-6">{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
