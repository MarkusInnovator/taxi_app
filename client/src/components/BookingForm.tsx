import { Form, Input, Button } from "@heroui/react";

function BookingForm() {
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Formularverarbeitung hier
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        isRequired
        label="Ihr Name"
        name="name"
        placeholder="Max Mustermann"
      />
      <Input
        isRequired
        label="Telefonnummer"
        name="phone"
        placeholder="+49 123 456789"
        type="tel"
      />
      <Input
        isRequired
        label="Abholadresse"
        name="pickup"
        placeholder="Musterstraße 1, 12345 Musterstadt"
      />
      <Input
        isRequired
        label="Zieladresse"
        name="destination"
        placeholder="Beispielweg 2, 54321 Beispielstadt"
      />
      <Input isRequired label="Datum" name="date" type="date" />
      <Input isRequired label="Uhrzeit" name="time" type="time" />
      <Button type="submit">Fahrt anfragen</Button>
    </Form>
  );
}

export default BookingForm;
