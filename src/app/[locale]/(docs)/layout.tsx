import { source } from "@/lib/source";
import { RootProvider } from "fumadocs-ui/provider";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { baseOptions } from "./layout.config";
import type { ReactNode } from "react";
import "./style.css";

// available languages that will be displayed on UI
// make sure `locale` is consistent with your i18n config
const locales = [
  {
    name: "English",
    locale: "en",
  },
];

export default async function DocsRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const lang = locale || "en";

  return (
    <RootProvider
      i18n={{
        locale: lang,
        locales,
      }}
      search={{
        options: {
          api: "/api/docs/search",
        },
      }}
    >
      <DocsLayout
        {...baseOptions(lang)}
        tree={source.pageTree[lang]}
        nav={{ ...baseOptions(lang).nav, mode: "top" }}
        sidebar={{
          tabs: [],
        }}
        tabMode="sidebar"
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
