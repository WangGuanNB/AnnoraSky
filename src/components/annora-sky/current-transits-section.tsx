import { ArrowRight, Clock3, Orbit, Sparkles } from "lucide-react";

import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import type { Section } from "@/types/blocks/section";

import { AnnoraButton } from "./annora-ui";

export default function CurrentTransitsSection({
  section,
}: {
  section: Section;
}) {
  if (section.disabled) return null;

  return (
    <section
      id={section.name}
      className="relative scroll-mt-20 overflow-hidden bg-[#302630] px-4 py-16 text-white sm:scroll-mt-24 sm:px-6 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 size-[32rem] rounded-full border border-white/[0.08]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 -left-44 size-[34rem] rounded-full border border-[#d7a878]/10"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7b7cc]">
            <Orbit className="size-4" aria-hidden="true" />
            {section.label}
          </p>
          <h2 className="mt-5 max-w-xl text-balance font-serif text-4xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-5xl">
            {section.title}
          </h2>
          {section.description && (
            <p className="mt-6 max-w-xl text-base leading-7 text-[#d5cbd1] sm:text-lg sm:leading-8">
              {section.description}
            </p>
          )}

          {section.buttons && section.buttons.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {section.buttons.map((button, index) => (
                <AnnoraButton
                  key={button.title}
                  asChild
                  tone={index === 0 ? "light" : "outline"}
                  className={
                    index === 0
                      ? undefined
                      : "border-white/25 bg-transparent text-white hover:border-white/45 hover:bg-white/[0.06] hover:text-white"
                  }
                >
                  <Link href={button.url as any}>
                    {button.title}
                    {index === 0 && <ArrowRight className="size-4" aria-hidden="true" />}
                  </Link>
                </AnnoraButton>
              ))}
            </div>
          )}

          <p className="mt-5 flex items-center gap-2 text-xs text-[#bbaeb6]">
            <Clock3 className="size-3.5" aria-hidden="true" />
            The preview below is illustrative; your chart creates the personal result.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_30px_90px_rgba(15,8,14,.28)] backdrop-blur sm:p-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d5a87d]">
                Example transit timeline
              </p>
              <p className="mt-1 font-serif text-xl">What&apos;s active now</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] text-[#d8cdd3]">
              Personal to your chart
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {section.items?.map((item, index) => (
              <article
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.055] p-4 transition hover:border-white/20 hover:bg-white/[0.08] sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d5a87d]">
                    {item.icon ? (
                      <Icon name={item.icon} className="size-3.5" />
                    ) : (
                      <Sparkles className="size-3.5" aria-hidden="true" />
                    )}
                    {item.label}
                  </span>
                  <span className="text-[10px] text-[#bfaebb]">
                    {index === 0 ? "0.8° orb" : index === 1 ? "1.4° orb" : "Next shift"}
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-lg text-white sm:text-xl">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-sm leading-6 text-[#d4c9cf]">{item.description}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
