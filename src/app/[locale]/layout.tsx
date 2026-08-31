import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { AppContextProvider } from "@/contexts/app";
import { Metadata } from "next";
import { NextAuthSessionProvider } from "@/auth/session";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const siteUrl = `${(process.env.NEXT_PUBLIC_WEB_URL || "https://annorasky.com").replace(/\/$/, "")}/`;
  const title = t("metadata.title") || "Free Birth Chart Calculator | Annora Sky";
  const description = t("metadata.description") || "Create your free birth chart with Annora Sky.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: `%s`,
      default: title,
    },
    description,
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: "Annora Sky",
      title,
      description,
      images: [
        {
          url: "/og.png",
          width: 1731,
          height: 909,
          alt: "Annora Sky — Your chart, in motion.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <NextAuthSessionProvider>
        <AppContextProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AppContextProvider>
      </NextAuthSessionProvider>
    </NextIntlClientProvider>
  );
}
