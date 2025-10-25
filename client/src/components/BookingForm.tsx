import { useState, type FormEvent } from "react";
import { Button, Form, Input } from "@heroui/react";

interface BookingFormData {
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
}

function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    phone: "",
    pickup: "",
    destination: "",
    date: "",
    time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Hier würde die API-Anfrage stattfinden
      // await fetch('/api/bookings', { method: 'POST', body: JSON.stringify(formData) })

      // Simuliere API-Call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        type: "success",
        message: "Ihre Buchungsanfrage wurde erfolgreich übermittelt!",
      });

      // Formular zurücksetzen
      setFormData({
        name: "",
        phone: "",
        pickup: "",
        destination: "",
        date: "",
        time: "",
      });
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Es gab einen Fehler. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Taxi jetzt buchen</h2>

      {submitStatus.type && (
        <div
          className={`mb-4 p-4 rounded ${
            submitStatus.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <Form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          isRequired
          label="Ihr Name"
          name="name"
          placeholder="Max Mustermann"
          value={formData.name}
          onChange={handleInputChange}
        />
        <Input
          isRequired
          label="Telefonnummer"
          name="phone"
          placeholder="+49 123 456789"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
        />
        <Input
          isRequired
          label="Abholadresse"
          name="pickup"
          placeholder="Musterstraße 1, 12345 Musterstadt"
          value={formData.pickup}
          onChange={handleInputChange}
        />
        <Input
          isRequired
          label="Zieladresse"
          name="destination"
          placeholder="Beispielweg 2, 54321 Beispielstadt"
          value={formData.destination}
          onChange={handleInputChange}
        />
        <Input
          isRequired
          label="Datum"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
        />
        <Input
          isRequired
          label="Uhrzeit"
          name="time"
          type="time"
          value={formData.time}
          onChange={handleInputChange}
        />
        <Button
          className="w-full"
          color="warning"
          isLoading={isSubmitting}
          size="lg"
          type="submit"
        >
          {isSubmitting ? "Wird gesendet..." : "Fahrt anfragen"}
        </Button>
      </Form>
    </div>
  );
}

export default BookingForm;
