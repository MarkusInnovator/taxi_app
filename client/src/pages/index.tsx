import { Link } from "react-router-dom";
import { Button } from "@heroui/react";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

interface ServiceCard {
  id: string;
  title: string;
  icon: string;
  description: string;
}

interface StatItem {
  id: string;
  value: string;
  label: string;
}

const CONTACT_PHONE = "+49123456789";
const CONTACT_EMAIL = "info@taximannheim.de";
const CONTACT_WHATSAPP = "49123456789";

const SERVICES: readonly ServiceCard[] = [
  {
    id: "airport",
    title: "Airport Transfer",
    icon: "✈",
    description: "Reliable transport to and from airports",
  },
  {
    id: "medical",
    title: "Medical Transport",
    icon: "🏥",
    description: "Professional medical transportation",
  },
  {
    id: "large-vehicle",
    title: "Large Vehicles",
    icon: "🚐",
    description: "Vans and minibuses for groups",
  },
  {
    id: "courier",
    title: "Courier Service",
    icon: "📦",
    description: "Fast and secure package delivery",
  },
  {
    id: "corporate",
    title: "Corporate Rides",
    icon: "🏢",
    description: "Business transportation solutions",
  },
  {
    id: "city",
    title: "City Rides",
    icon: "🚕",
    description: "Quick urban transportation",
  },
] as const;

const STATS: readonly StatItem[] = [
  { id: "availability", value: "24/7", label: "Available" },
  { id: "experience", value: "15+", label: "Years Experience" },
  { id: "drivers", value: "50+", label: "Professional Drivers" },
  { id: "satisfaction", value: "98%", label: "Customer Satisfaction" },
] as const;

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-16 py-8 md:py-12">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center gap-6 text-center px-4">
          <div className="max-w-4xl">
            <h1 className={title({ size: "lg" })}>
              Professional Taxi Service
              <br />
              <span className={title({ color: "yellow", size: "lg" })}>
                Available 24/7
              </span>
            </h1>
            <p className={subtitle({ class: "mt-6" })}>
              Fast, reliable, and professional taxi service in Mannheim and
              surrounding areas.
              <br />
              Fixed prices · Multiple payment options · Licensed drivers
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <Button
              as={Link}
              className="font-semibold"
              color="warning"
              size="lg"
              to="/booking"
              variant="shadow"
            >
              Book a Ride
            </Button>
            <Button
              as="a"
              className="font-semibold"
              href={`tel:${CONTACT_PHONE}`}
              size="lg"
              variant="bordered"
            >
              Call Now
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
            {STATS.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </span>
                <span className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="w-full px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive transportation solutions for every need
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="group p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full px-4">
          <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                We&apos;re here to help you 24 hours a day, 7 days a week
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                href={`tel:${CONTACT_PHONE}`}
              >
                <span className="text-3xl mb-3">📞</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Phone
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  +49 123 456 789
                </span>
              </a>

              <a
                className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                <span className="text-3xl mb-3">📧</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {CONTACT_EMAIL}
                </span>
              </a>

              <a
                className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                href={`https://wa.me/${CONTACT_WHATSAPP}`}
                rel="noreferrer"
                target="_blank"
              >
                <span className="text-3xl mb-3">💬</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  WhatsApp
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Message Us
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
