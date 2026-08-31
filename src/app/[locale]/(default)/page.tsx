import CurrentTransitsSection from "@/components/annora-sky/current-transits-section";
import HomepageChartExperience from "@/components/annora-sky/homepage-chart-experience";
import MethodologyStrip from "@/components/annora-sky/methodology-strip";
import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Feature from "@/components/blocks/feature";
import Feature2 from "@/components/blocks/feature2";
import Feature3 from "@/components/blocks/feature3";
import FeatureWhatTwo from "@/components/blocks/feature-what-two";
import Testimonial from "@/components/blocks/testimonial";
import { getCanonicalUrl } from "@/lib/utils";
import { getLandingPage } from "@/services/page";
import type { Metadata } from "next";

// 启用 ISR（增量静态再生）：24小时重新生成一次，降低 CPU 消耗
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = "Free Astrology Birth Chart Calculator | Annora Sky";
  const description =
    "Create a free Western astrology birth chart from your birth date, time, and place. Understand your Sun, Moon, Rising, houses, aspects, and current transits.";

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale),
    },
  };

  return metadata;
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getLandingPage(locale);
  const siteUrl = (process.env.NEXT_PUBLIC_WEB_URL || "https://annorasky.com").replace(
    /\/$/,
    "",
  );
  const faqEntities = (page.faq?.items || [])
    .filter((item) => item.title && item.description)
    .map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.description,
      },
    }));
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Annora Sky Birth Chart Calculator",
      url: `${siteUrl}/`,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      description:
        "A free Western astrology birth chart calculator for understanding your Sun, Moon, Rising, houses, aspects, and current transits.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Western tropical birth chart",
        "Sun, Moon, and Rising signs",
        "Whole Sign houses",
        "Major planetary aspects",
        "Current transit highlights",
        "Device-local saved charts",
      ],
    },
    ...(faqEntities.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqEntities,
          },
        ]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      {page.hero && (
        <HomepageChartExperience hero={page.hero} />
      )}

      {page.introduce && (
        <div className="border-y border-border/60 bg-card/55">
          <FeatureWhatTwo section={page.introduce} />
        </div>
      )}
      {page.feature && <Feature section={page.feature} />}
      {page.transits && <CurrentTransitsSection section={page.transits} />}
      {page.benefit && (
        <div className="border-y border-border/60 bg-[#f3e9ef]/55">
          <Feature2 section={page.benefit} />
        </div>
      )}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.methodology && <MethodologyStrip section={page.methodology} />}
      {page.faq && (
        <div className="border-t border-border/60 bg-card/45">
          <FAQ section={page.faq} />
        </div>
      )}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
