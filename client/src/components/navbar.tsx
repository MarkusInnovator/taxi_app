import type { FC } from "react";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { Logo } from "@/components/icons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitch } from "@/components/theme-switch";
import { useLanguage } from "@/contexts/LanguageContext";

const PHONE_NUMBER = "+49123456789" as const;

/**
 * Navbar component
 * Main navigation bar with responsive menu
 */
export const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.booking, href: "/booking" },
    { label: t.nav.pricing, href: "/pricing" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.docs, href: "/docs" },
  ];

  return (
    <HeroUINavbar
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="max-w-fit gap-3">
          <Link
            className="flex items-center justify-start gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
            <p className="font-bold text-inherit">🚖 Taxi Mannheim</p>
          </Link>
        </NavbarBrand>
        <div className="ml-2 hidden justify-start gap-4 lg:flex">
          {navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:font-medium data-[active=true]:text-primary",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden basis-1/5 sm:flex sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden gap-2 sm:flex">
          <LanguageSwitcher />
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            as={Link}
            className="bg-default-900 text-sm font-normal text-white hover:bg-default-800 dark:bg-default-100 dark:text-black dark:hover:bg-default-200"
            href={`tel:${PHONE_NUMBER}`}
            variant="flat"
          >
            📞 {t.home.callNow}
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="basis-1 pl-4 sm:hidden" justify="end">
        <LanguageSwitcher />
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                className="w-full"
                color="foreground"
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
