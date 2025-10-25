export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Taxi Mannheim",
  description:
    "Ihr zuverlässiger Taxi-Service in Mannheim - 24/7 verfügbar, feste Preise, professionelle Fahrer.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Buchung",
      href: "/booking",
    },
    {
      label: "prices",
      href: "/pricing",
    },
    {
      label: "Über Uns",
      href: "/about",
    },
    {
      label: "Dokumentation",
      href: "/docs",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Buchung",
      href: "/booking",
    },
    {
      label: "Preise",
      href: "/pricing",
    },
    {
      label: "Über Uns",
      href: "/about",
    },
    {
      label: "Dokumentation",
      href: "/docs",
    },
  ],
  links: {
    github: "https://github.com/MarkusInnovator/taxi_app",
    twitter: "https://twitter.com/taximannheim",
    docs: "/docs",
    discord: "#",
    sponsor: "#",
  },
};
