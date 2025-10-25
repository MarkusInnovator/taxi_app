import type { SwitchProps } from "@heroui/switch";
import type { FC } from "react";

import { useEffect, useState } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useSwitch } from "@heroui/switch";
import { useTheme } from "@heroui/use-theme";
import clsx from "clsx";

import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";

interface ThemeSwitchProps {
  readonly className?: string;
  readonly classNames?: SwitchProps["classNames"];
}

/**
 * ThemeSwitch component
 * Provides a toggle switch for light/dark mode themes
 */
export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === "light",
    onChange: () => setTheme(theme === "light" ? "dark" : "light"),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div className="h-6 w-6" />;
  }

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "cursor-pointer px-px transition-opacity hover:opacity-80",
          className,
          classNames?.base,
        ),
      })}
      aria-label={isSelected ? "Switch to dark mode" : "Switch to light mode"}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "flex h-auto w-auto items-center justify-center",
              "rounded-lg bg-transparent",
              "mx-0 px-0 pt-px",
              "!text-default-500",
              "group-data-[selected=true]:bg-transparent",
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {isSelected ? (
          <MoonFilledIcon size={22} />
        ) : (
          <SunFilledIcon size={22} />
        )}
      </div>
    </Component>
  );
};
