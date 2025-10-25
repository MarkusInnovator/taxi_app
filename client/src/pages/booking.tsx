import BookingForm from "@/components/BookingForm";
import DefaultLayout from "@/layouts/default";

export default function BookingPage() {
  return (
    <DefaultLayout>
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Taxi online buchen</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Füllen Sie einfach das untenstehende Formular aus und wir bestätigen
            Ihre Buchung innerhalb weniger Minuten. Alternativ können Sie uns
            auch direkt unter{" "}
            <a
              className="text-yellow-600 hover:underline font-semibold"
              href="tel:+49123456789"
            >
              +49 123 456 789
            </a>{" "}
            erreichen.
          </p>
        </div>
        <BookingForm />
      </div>
    </DefaultLayout>
  );
}
