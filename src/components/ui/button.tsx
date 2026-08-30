import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
  {
    variants: {
      variant: {
        primary:
          "bg-citrus text-cream hover:bg-citrus-deep shadow-[0_1px_0_color-mix(in_oklab,var(--color-ink)_12%,transparent)]",
        leaf: "bg-leaf text-cream hover:bg-leaf-deep",
        sun: "bg-sun text-ink hover:bg-sun-deep",
        outline:
          "bg-cream/70 text-leaf ring-1 ring-leaf/20 hover:bg-cream hover:ring-leaf/40",
        ghost: "bg-transparent text-ink hover:bg-ink/8",
        cream: "bg-cream text-leaf hover:bg-paper",
      },
      size: {
        sm: "h-10 px-3.5 text-sm rounded-full",
        md: "h-11 px-5 text-sm rounded-full",
        lg: "h-12 px-6 text-base rounded-full",
        icon: "size-11 rounded-full",
        chip: "h-10 px-4 text-sm rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
