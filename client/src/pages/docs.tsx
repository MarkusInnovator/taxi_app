import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

interface DocumentationSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const CONTACT_PHONE = "+49123456789";
const CONTACT_EMAIL = "info@taximannheim.de";

const DOCUMENTATION_SECTIONS: readonly DocumentationSection[] = [
  {
    id: "booking",
    title: "How to Book a Taxi",
    content: (
      <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>Navigate to the booking page</li>
        <li>Fill out the form with your details</li>
        <li>Select your preferred date and time</li>
        <li>Review and submit your request</li>
        <li>Receive confirmation within 5 minutes</li>
      </ol>
    ),
  },
  {
    id: "payment",
    title: "Payment Methods",
    content: (
      <div className="space-y-3">
        <p className="text-gray-700 dark:text-gray-300">
          We accept the following payment methods:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Cash payment</li>
          <li>Debit cards (EC-Karte)</li>
          <li>Credit cards (Visa, Mastercard, American Express)</li>
          <li>Corporate accounts (by arrangement)</li>
          <li>Mobile payment options</li>
        </ul>
      </div>
    ),
  },
  {
    id: "cancellation",
    title: "Cancellation Policy",
    content: (
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <p>
          We understand that plans can change. Our cancellation policy is
          designed to be fair and flexible:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Free cancellation</strong> up to 2 hours before scheduled
            pickup
          </li>
          <li>
            <strong>€15 cancellation fee</strong> for cancellations within 2
            hours
          </li>
          <li>
            <strong>No-show fee</strong> of €25 applies if the driver arrives
            and you&apos;re not available
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            How far in advance should I book?
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            We recommend booking at least 30 minutes in advance, though same-day
            bookings are often possible depending on availability.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Do you provide child seats?
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            Yes, we can provide child seats upon request. Please mention this in
            the additional notes when booking.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Can I book a taxi for someone else?
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            Absolutely! Just provide the passenger&apos;s contact details and
            pickup information when booking.
          </p>
        </div>
      </div>
    ),
  },
] as const;

export default function DocsPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-16 py-8 md:py-12 px-4">
        {/* Header */}
        <section className="flex flex-col items-center justify-center gap-4 text-center max-w-4xl mx-auto">
          <h1 className={title()}>Documentation</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Everything you need to know about our taxi service
          </p>
        </section>

        {/* Documentation Sections */}
        <section className="max-w-4xl mx-auto w-full space-y-8">
          {DOCUMENTATION_SECTIONS.map((section) => (
            <div
              key={section.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {section.title}
              </h2>
              {section.content}
            </div>
          ))}
        </section>

        {/* Contact Support */}
        <section className="max-w-4xl mx-auto w-full">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Need More Help?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Our support team is available 24/7 to assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors font-semibold"
                href={`tel:${CONTACT_PHONE}`}
              >
                📞 Call Us
              </a>
              <a
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors font-semibold"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                📧 Email Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
