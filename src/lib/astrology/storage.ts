import { PENDING_CHART_KEY, SAVED_CHARTS_KEY } from "./constants";
import type { BirthDetails, SavedChart } from "./types";

export function setPendingChart(details: BirthDetails) {
  window.sessionStorage.setItem(PENDING_CHART_KEY, JSON.stringify(details));
}

export function getPendingChart(): BirthDetails | null {
  const rawValue = window.sessionStorage.getItem(PENDING_CHART_KEY);
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue) as BirthDetails;
  } catch {
    return null;
  }
}

export function getSavedCharts(): SavedChart[] {
  const rawValue = window.localStorage.getItem(SAVED_CHARTS_KEY);
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue) as SavedChart[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveChartToDevice(details: BirthDetails): SavedChart {
  const savedCharts = getSavedCharts();
  const existing = savedCharts.find(
    (chart) =>
      chart.details.birthDate === details.birthDate &&
      chart.details.birthTime === details.birthTime &&
      chart.details.location.id === details.location.id
  );
  const now = new Date().toISOString();

  if (existing) {
    const updated = { ...existing, details, updatedAt: now };
    window.localStorage.setItem(
      SAVED_CHARTS_KEY,
      JSON.stringify(savedCharts.map((chart) => (chart.id === existing.id ? updated : chart)))
    );
    return updated;
  }

  const savedChart: SavedChart = {
    id: `saved-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
    details,
  };

  window.localStorage.setItem(
    SAVED_CHARTS_KEY,
    JSON.stringify([savedChart, ...savedCharts])
  );
  return savedChart;
}

export function deleteSavedChart(id: string) {
  const savedCharts = getSavedCharts().filter((chart) => chart.id !== id);
  window.localStorage.setItem(SAVED_CHARTS_KEY, JSON.stringify(savedCharts));
  return savedCharts;
}

