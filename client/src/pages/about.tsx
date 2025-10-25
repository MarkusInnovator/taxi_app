import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface TeamValue {
  id: string;
  title: string;
  description: string;
}

const BENEFITS: readonly Benefit[] = [
  {
    id: "availability",
    title: "24/7 Availability",
    description: "Round-the-clock service, every day of the year",
    icon: "🕐",
  },
  {
    id: "pricing",
    title: "Transparent Pricing",
    description: "Fixed rates with no hidden fees",
    icon: "💰",
  },
  {
    id: "fleet",
    title: "Modern Fleet",
    description: "Well-maintained and comfortable vehicles",
    icon: "🚗",
  },
  {
    id: "drivers",
    title: "Professional Drivers",
    description: "Experienced, licensed, and friendly staff",
    icon: "👔",
  },
  {
    id: "payment",
    title: "Flexible Payment",
    description: "Cash, card, and corporate accounts accepted",
    icon: "💳",
  },
  {
    id: "safety",
    title: "Safety First",
    description: "Your comfort and security are our priority",
    icon: "🛡️",
  },
] as const;

const VALUES: readonly TeamValue[] = [
  {
    id: "reliability",
    title: "Reliability",
    description:
      "We pride ourselves on punctuality and dependable service. Your time matters to us.",
  },
  {
    id: "professionalism",
    title: "Professionalism",
    description:
      "Our drivers are trained professionals committed to providing excellent service.",
  },
  {
    id: "customer-focus",
    title: "Customer Focus",
    description:
      "Every ride is tailored to your needs. Your satisfaction is our success.",
  },
] as const;

export default function AboutPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-16 py-8 md:py-12 px-4">
        {/* Header Section */}
        <section className="flex flex-col items-center justify-center gap-4 text-center max-w-4xl mx-auto">
          <h1 className={title()}>About Us</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Your trusted partner for transportation in Mannheim and beyond
          </p>
        </section>

        {/* Introduction */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Welcome to Taxi Mannheim - your reliable partner for passenger and
              cargo transportation in Mannheim and the surrounding region.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              For over 15 years, we have been providing professional taxi
              services with modern vehicles and experienced drivers. Your
              comfort and safety are our top priorities, and we strive to exceed
              your expectations with every ride.
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Experience the difference with our premium service
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.id}
                className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              The principles that guide everything we do
            </p>
          </div>

          <div className="space-y-6">
            {VALUES.map((value, index) => (
              <div
                key={value.id}
                className="p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
