import Icon from "@/components/icon";
import type { Section } from "@/types/blocks/section";

export default function MethodologyStrip({ section }: { section: Section }) {
  if (section.disabled) return null;

  return (
    <section id={section.name} className="px-4 py-10 sm:px-6 md:py-14">
      <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-[#d9cad3] bg-[#f2e9ed] px-5 py-6 shadow-sm sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b5c7e]">
              {section.label}
            </p>
            <h2 className="mt-2 font-serif text-2xl text-[#352b34] sm:text-3xl">
              {section.title}
            </h2>
            {section.description && (
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#71656c]">
                {section.description}
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {section.items?.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-white/70 bg-white/60 px-4 py-3"
              >
                {item.icon && (
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-[#6d465f]">
                    <Icon name={item.icon} className="size-4" />
                  </span>
                )}
                <span>
                  <span className="block text-sm font-semibold text-[#3d313a]">{item.title}</span>
                  {item.description && (
                    <span className="mt-0.5 block text-xs leading-5 text-[#796d74]">
                      {item.description}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
