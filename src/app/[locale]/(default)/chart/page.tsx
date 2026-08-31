import type { Metadata } from "next";

import ChartResult from "@/components/annora-sky/chart-result";

export const metadata: Metadata = {
  title: "Your Birth Chart | Annora Sky",
  description: "Your private Annora Sky birth chart and current transit snapshot.",
  robots: { index: false, follow: false },
};

export default function ChartPage() {
  return <ChartResult />;
}

