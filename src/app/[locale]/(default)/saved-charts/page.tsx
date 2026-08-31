import type { Metadata } from "next";

import SavedCharts from "@/components/annora-sky/saved-charts";

export const metadata: Metadata = {
  title: "Saved Charts | Annora Sky",
  description: "Birth charts saved privately in this browser.",
  robots: { index: false, follow: false },
};

export default function SavedChartsPage() {
  return <SavedCharts />;
}

