import { title, subtitle } from "@/components/primitives";
import BookingForm from "@/components/BookingForm";
import DefaultLayout from "@/layouts/default";

const CONTACT_PHONE = "+49123456789";
const CONTACT_PHONE_DISPLAY = "+49 123 456 789";

export default function BookingPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-12 md:py-16 px-4">
        <div className="text-center max-w-3xl">
          <h1 className={title()}>Book Your Ride</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Fast, reliable taxi service available 24/7
          </p>
          <p className="mt-6 text-base text-gray-600 dark:text-gray-400">
            Fill out the form below and we&apos;ll confirm your booking within
            minutes. Need immediate assistance? Call us directly at{" "}
            <a
              className="text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 font-semibold transition-colors"
              href={`tel:${CONTACT_PHONE}`}
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </p>
        </div>

        <div className="w-full max-w-4xl mt-8">
          <BookingForm />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-lg mb-2">Quick Response</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Confirmation within 5 minutes
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-semibold text-lg mb-2">Flexible Payment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cash, card, or corporate account
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-3xl mb-3">🚗</div>
            <h3 className="font-semibold text-lg mb-2">Professional Drivers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Experienced and licensed staff
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
