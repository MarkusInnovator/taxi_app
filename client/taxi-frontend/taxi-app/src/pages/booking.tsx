import DefaultLayout from "@/layouts/default";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  return (
    <DefaultLayout>
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Buchung</h1>
        <div className="py-16 px-4 bg-gray-500 min-h-screen">
          <BookingForm />
        </div>
      </div>
    </DefaultLayout>
  );
}
