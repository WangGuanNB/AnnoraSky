import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AnnoraButtonProps = React.ComponentProps<typeof Button> & {
  tone?: "primary" | "outline" | "light" | "text" | "dangerIcon";
};

const buttonTones: Record<NonNullable<AnnoraButtonProps["tone"]>, string> = {
  primary:
    "h-12 rounded-xl bg-annora-plum px-5 font-semibold text-white shadow-annora-button hover:-translate-y-0.5 hover:bg-annora-plum-hover hover:text-white",
  outline:
    "h-12 rounded-xl border-annora-outline bg-white/60 px-5 font-semibold text-annora-plum shadow-none hover:bg-white hover:text-annora-plum",
  light:
    "h-12 rounded-xl bg-[#fff9f4] px-6 font-semibold text-[#513448] shadow-none hover:-translate-y-0.5 hover:bg-white hover:text-[#513448]",
  text:
    "h-auto rounded-none bg-transparent p-0 text-annora-plum-muted shadow-none hover:bg-transparent hover:text-annora-plum-hover",
  dangerIcon:
    "size-9 rounded-full border border-[#dfd2d8] bg-transparent p-0 text-[#8a6f7f] shadow-none hover:border-[#c99490] hover:bg-[#faeeec] hover:text-[#824c48]",
};

export function AnnoraButton({
  tone = "primary",
  className,
  ...props
}: AnnoraButtonProps) {
  return <Button className={cn(buttonTones[tone], className)} {...props} />;
}

export function AnnoraCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-[1.75rem] border-annora-card-border bg-annora-panel py-0 text-annora-ink",
        className
      )}
      {...props}
    />
  );
}

export function AnnoraEyebrow({
  className,
  ...props
}: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-[#cdbbc6] bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-annora-plum-muted",
        className
      )}
      {...props}
    />
  );
}

export function AnnoraInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-12 rounded-xl border-[#d9cfd5] bg-annora-field px-4 text-base shadow-none transition focus-visible:border-annora-mauve focus-visible:ring-annora-mauve/15",
        className
      )}
      {...props}
    />
  );
}
