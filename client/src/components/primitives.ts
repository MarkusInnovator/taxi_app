import { tv, type VariantProps } from "tailwind-variants";

/**
 * Title component variant configuration
 * Provides consistent typography styles for headings
 */
export const title = tv({
  base: "font-semibold tracking-tight inline",
  variants: {
    color: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
      gradient:
        "bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent",
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl leading-9",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "block w-full",
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
    fullWidth: false,
  },
});

/**
 * Subtitle component variant configuration
 * Provides consistent typography styles for subtitles
 */
export const subtitle = tv({
  base: "text-lg lg:text-xl text-default-600 dark:text-default-500 block max-w-full my-2",
  variants: {
    fullWidth: {
      true: "w-full",
      false: "w-full md:w-1/2",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

export type TitleVariants = VariantProps<typeof title>;
export type SubtitleVariants = VariantProps<typeof subtitle>;
