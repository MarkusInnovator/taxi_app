import type { ChangeEvent, FormEvent } from "react";

import { useCallback, useState } from "react";
import { Button, Form, Input, Textarea } from "@heroui/react";

interface BookingFormData {
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  passengers: string;
  notes: string;
}

interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const INITIAL_FORM_DATA: BookingFormData = {
  name: "",
  phone: "",
  pickup: "",
  destination: "",
  date: "",
  time: "",
  passengers: "1",
  notes: "",
};

const INITIAL_SUBMIT_STATUS: SubmitStatus = {
  type: null,
  message: "",
};

const SUCCESS_MESSAGE = "Your booking request has been submitted successfully!";
const ERROR_MESSAGE = "An error occurred. Please try again.";
const API_DELAY_MS = 1000;
const FORM_RESET_DELAY_MS = 3000;

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

  return phoneRegex.test(phone) && phone.length >= 10;
};

const validateForm = (data: BookingFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name.trim() || data.name.length < 2) {
    errors.name = "Please enter a valid name";
  }

  if (!validatePhone(data.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (!data.pickup.trim() || data.pickup.length < 5) {
    errors.pickup = "Please enter a valid pickup address";
  }

  if (!data.destination.trim() || data.destination.length < 5) {
    errors.destination = "Please enter a valid destination address";
  }

  if (!data.date) {
    errors.date = "Please select a date";
  }

  if (!data.time) {
    errors.time = "Please select a time";
  }

  const passengers = parseInt(data.passengers, 10);

  if (isNaN(passengers) || passengers < 1 || passengers > 8) {
    errors.passengers = "Please enter a valid number of passengers (1-8)";
  }

  return errors;
};

function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(
    INITIAL_SUBMIT_STATUS,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setSubmitStatus(INITIAL_SUBMIT_STATUS);
    setErrors({});
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationErrors = validateForm(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        return;
      }

      setErrors({});
      setIsSubmitting(true);
      setSubmitStatus(INITIAL_SUBMIT_STATUS);

      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/bookings', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        // if (!response.ok) throw new Error('Booking failed');

        await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));

        setSubmitStatus({
          type: "success",
          message: SUCCESS_MESSAGE,
        });

        setTimeout(() => {
          resetForm();
        }, FORM_RESET_DELAY_MS);
      } catch {
        setSubmitStatus({
          type: "error",
          message: ERROR_MESSAGE,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, resetForm],
  );

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  }, []);

  const handleTextareaChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    [],
  );

  const getTodayDate = () => {
    const today = new Date();

    return today.toISOString().split("T")[0];
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Book Your Taxi
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            All fields marked with{" "}
            <span className="text-red-500 font-semibold">*</span> are required
          </p>
        </div>

        {submitStatus.type && (
          <div
            className={`mb-8 p-5 rounded-xl border-2 ${
              submitStatus.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-900 dark:text-green-200"
                : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-900 dark:text-red-200"
            }`}
            role="alert"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {submitStatus.type === "success" ? "✓" : "⚠"}
              </span>
              <p className="font-semibold text-base">{submitStatus.message}</p>
            </div>
          </div>
        )}

        <Form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              isRequired
              errorMessage={errors.name}
              isInvalid={!!errors.name}
              label="Full Name"
              labelPlacement="outside"
              name="name"
              placeholder="John Doe"
              type="text"
              value={formData.name}
              variant="bordered"
              onChange={handleInputChange}
            />

            <Input
              isRequired
              errorMessage={errors.phone}
              isInvalid={!!errors.phone}
              label="Phone Number"
              labelPlacement="outside"
              name="phone"
              placeholder="+49 123 456789"
              type="tel"
              value={formData.phone}
              variant="bordered"
              onChange={handleInputChange}
            />
          </div>

          <Input
            isRequired
            errorMessage={errors.pickup}
            isInvalid={!!errors.pickup}
            label="Pickup Address"
            labelPlacement="outside"
            name="pickup"
            placeholder="123 Main Street, Mannheim"
            type="text"
            value={formData.pickup}
            variant="bordered"
            onChange={handleInputChange}
          />

          <Input
            isRequired
            errorMessage={errors.destination}
            isInvalid={!!errors.destination}
            label="Destination Address"
            labelPlacement="outside"
            name="destination"
            placeholder="456 Market Avenue, Frankfurt"
            type="text"
            value={formData.destination}
            variant="bordered"
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              isRequired
              errorMessage={errors.date}
              isInvalid={!!errors.date}
              label="Pickup Date"
              labelPlacement="outside"
              min={getTodayDate()}
              name="date"
              type="date"
              value={formData.date}
              variant="bordered"
              onChange={handleInputChange}
            />

            <Input
              isRequired
              errorMessage={errors.time}
              isInvalid={!!errors.time}
              label="Pickup Time"
              labelPlacement="outside"
              name="time"
              type="time"
              value={formData.time}
              variant="bordered"
              onChange={handleInputChange}
            />

            <Input
              isRequired
              errorMessage={errors.passengers}
              isInvalid={!!errors.passengers}
              label="Passengers"
              labelPlacement="outside"
              max="8"
              min="1"
              name="passengers"
              placeholder="1"
              type="number"
              value={formData.passengers}
              variant="bordered"
              onChange={handleInputChange}
            />
          </div>

          <Textarea
            description="Any special requirements or notes"
            label="Additional Notes"
            labelPlacement="outside"
            maxLength={500}
            name="notes"
            placeholder="e.g., Need child seat, luggage, wheelchair accessible..."
            value={formData.notes}
            variant="bordered"
            onChange={handleTextareaChange}
          />

          <div className="pt-4">
            <Button
              className="w-full h-14 text-lg font-semibold"
              color="warning"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              size="lg"
              type="submit"
            >
              {isSubmitting ? "Submitting Request..." : "Request Ride"}
            </Button>
          </div>
        </Form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            By submitting this form, you agree to our{" "}
            <a
              className="text-yellow-600 hover:underline font-medium"
              href="/terms"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              className="text-yellow-600 hover:underline font-medium"
              href="/privacy"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
