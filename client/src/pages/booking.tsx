import type { FC } from "react";

import BookingForm from "@/components/BookingForm";
import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

interface FeatureCardProps {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly delay: string;
}

const CONTACT_PHONE = "+49123456789" as const;
const CONTACT_PHONE_DISPLAY = "+49 123 456 789" as const;

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Confirmation",
    description: "Real-time booking status",
    delay: "0s",
  },
  {
    icon: "💳",
    title: "Multiple Payment Options",
    description: "Cash, card & digital wallets",
    delay: "0.1s",
  },
  {
    icon: "🚗",
    title: "Premium Fleet",
    description: "Modern vehicles & expert drivers",
    delay: "0.2s",
  },
] as const;

const FeatureCard: FC<FeatureCardProps> = ({
  icon,
  title: cardTitle,
  description,
  delay,
}) => (
  <div
    className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/50 p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-gray-300 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700"
    style={{ animationDelay: delay }}
  >
    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-2xl transition-all duration-500 group-hover:scale-150" />
    <div className="relative">
      <div className="mb-6 text-5xl">{icon}</div>
      <h3 className="mb-3 text-xl font-bold tracking-tight">{cardTitle}</h3>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  </div>
);

const BookingPage: FC = () => {
  return (
    <DefaultLayout>
      <section className="relative min-h-screen px-4 py-16 md:py-24">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />

        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="relative mb-16 text-center">
            <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-3xl" />
            <h1
              className={title({
                class:
                  "mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-gray-200 dark:to-white",
              })}
            >
              Reserve Your Journey
            </h1>
            <p className={subtitle({ class: "mx-auto max-w-2xl" })}>
              Experience premium transportation with seamless booking
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-6 py-3 text-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
              <span className="text-gray-600 dark:text-gray-400">
                Need immediate support?
              </span>
              <a
                className="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                href={`tel:${CONTACT_PHONE}`}
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>

          {/* Booking Form */}
          <div className="relative">
            <div className="absolute -left-4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
            <div className="absolute -right-4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
            <div className="relative">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default BookingPage;
