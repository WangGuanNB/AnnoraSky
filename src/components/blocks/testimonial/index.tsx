import { Quote, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Section as SectionType } from "@/types/blocks/section";

export default function Testimonial({ section }: { section: SectionType }) {
  if (section.disabled) return null;

  const isPreview = section.name === "testimonial-preview";

  return (
    <section id={section.name} className="border-y border-border/55 bg-card/55 py-12 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {section.label && (
            <Badge variant="outline" className="mb-5">
              {section.label}
            </Badge>
          )}
          <h2 className="text-balance font-serif text-4xl font-semibold tracking-[-0.035em] lg:text-5xl">
            {section.title}
          </h2>
          {section.description && (
            <p className="mx-auto mt-5 max-w-3xl leading-7 text-muted-foreground lg:text-lg">
              {section.description}
            </p>
          )}
        </div>

        {isPreview && (
          <div className="mx-auto mt-7 max-w-3xl rounded-xl border border-[#d8c6b9] bg-[#f7ede5] px-4 py-3 text-center text-xs leading-5 text-[#765848]">
            Preview only: these are sample personas and draft quotes for layout review. Replace them with verified user feedback before publishing.
          </div>
        )}

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-3">
          {section.items?.map((item, index) => (
            <Card
              key={`${item.title}-${index}`}
              className="relative flex min-h-[280px] flex-col overflow-hidden rounded-[1.6rem] border-border/65 bg-[#fffdfb] p-6 shadow-[0_16px_45px_rgba(70,44,63,.07)]"
            >
              <Quote className="absolute right-5 top-5 size-8 text-primary/10" aria-hidden="true" />

              <div className="flex items-center justify-between gap-4">
                {isPreview ? (
                  <Badge className="rounded-full bg-[#f2e8ed] text-[#6d465f] hover:bg-[#f2e8ed]">
                    Draft quote
                  </Badge>
                ) : (
                  <div className="flex gap-1" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="size-4 fill-[#b57a4c] text-[#b57a4c]"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                )}
              </div>

              <q className="mt-6 flex-1 font-serif text-xl leading-8 text-[#3c3039]">
                {item.description}
              </q>

              <div className="mt-7 flex items-center gap-3 border-t border-[#eadfe4] pt-5">
                <Avatar className="size-10 border border-[#dfd2d8]">
                  {item.image?.src && <AvatarImage src={item.image.src} alt={item.image.alt || ""} />}
                  <AvatarFallback className="bg-[#5d3c55] font-serif text-sm text-white">
                    {(item.title || "A").slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-[#3e323b]">{item.title}</p>
                  {item.label && <p className="text-xs text-[#857780]">{item.label}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
