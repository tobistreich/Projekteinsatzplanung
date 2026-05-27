import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-7 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-4!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        skill: "bg-cyan-100 text-cyan-800 [a]:hover:bg-cyan-200",
        project:
          "bg-indigo-100 text-indigo-700 [a]:hover:bg-indigo-200",
        destructive:
          "bg-red-100 text-red-800 focus-visible:ring-red-200 [a]:hover:bg-red-200",
        disabled:
          "border-border bg-neutral-200 text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        team: "bg-violet-100 text-violet-800 [a]:hover:bg-violet-200",
        "status-active": "bg-green-50 text-green-700 [a]:hover:bg-green-100",
        "status-planned": "bg-amber-100 text-amber-800 [a]:hover:bg-amber-200",
        "status-done": "bg-slate-100 text-slate-600 [a]:hover:bg-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
