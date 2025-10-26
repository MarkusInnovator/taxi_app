import type { ChangeEvent, FC, FormEvent } from "react";

import { useCallback, useState } from "react";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";

import { useLanguage } from "@/contexts/LanguageContext";

interface BookingFormData {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly pickupLocation: string;
  readonly dropoffLocation: string;
  readonly vehicleType: string;
  readonly scheduledDate: string;
  readonly scheduledTime: string;
  readonly passengerCount: string;
  readonly specialRequests: string;
}

interface SubmitStatus {
  readonly type: "success" | "error" | null;
  readonly message: string;
}

const INITIAL_FORM_DATA: BookingFormData = {
  fullName: "",
  email: "",
  phone: "",
  pickupLocation: "",
  dropoffLocation: "",
  vehicleType: "",
  scheduledDate: "",
  scheduledTime: "",
  passengerCount: "1",
  specialRequests: "",
};

const INITIAL_SUBMIT_STATUS: SubmitStatus = {
  type: null,
  message: "",
};

const API_DELAY_MS = 1500;
const FORM_RESET_DELAY_MS = 4000;

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

  return phoneRegex.test(phone) && phone.length >= 10;
};

const validateForm = (data: BookingFormData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!data.fullName.trim() || data.fullName.length < 2) {
    errors.fullName = "";
  }

  if (!validateEmail(data.email)) {
    errors.email = "";
  }

  if (!validatePhone(data.phone)) {
    errors.phone = "";
  }

  if (!data.pickupLocation.trim() || data.pickupLocation.length < 5) {
    errors.pickupLocation = "";
  }

  if (!data.dropoffLocation.trim() || data.dropoffLocation.length < 5) {
    errors.dropoffLocation = "";
  }

  if (!data.vehicleType) {
    errors.vehicleType = "";
  }

  if (!data.scheduledDate) {
    errors.scheduledDate = "";
  }

  if (!data.scheduledTime) {
    errors.scheduledTime = "";
  }

  const passengers = parseInt(data.passengerCount, 10);

  if (isNaN(passengers) || passengers < 1 || passengers > 8) {
    errors.passengerCount = "";
  }

  return errors;
};

const BookingForm: FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(
    INITIAL_SUBMIT_STATUS,
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const vehicleTypes = [
    { key: "standard", label: t.booking.vehicleTypes.standard },
    { key: "premium", label: t.booking.vehicleTypes.premium },
    { key: "van", label: t.booking.vehicleTypes.van },
    { key: "luxury", label: t.booking.vehicleTypes.luxury },
    { key: "suv", label: t.booking.vehicleTypes.suv },
  ];

  const getTodayDate = (): string => {
    const today = new Date();

    return today.toISOString().split("T")[0];
  };

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
        await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));

        setSubmitStatus({
          type: "success",
          message: t.booking.success,
        });

        setTimeout(() => {
          resetForm();
        }, FORM_RESET_DELAY_MS);
      } catch {
        setSubmitStatus({
          type: "error",
          message: t.booking.error,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, resetForm, t.booking.error, t.booking.success],
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

  const handleSelectChange = useCallback((value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      vehicleType: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      vehicleType: "",
    }));
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Decorative elements */}
      <div className="absolute -left-8 top-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
      <div className="absolute -right-8 bottom-20 h-40 w-40 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/80">
        {/* Header */}
        <div className="border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 px-8 py-10 dark:border-gray-800/50 dark:from-gray-900/50 dark:to-gray-900/50">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-3xl">🚖</span>
            <h2 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-300">
              {t.booking.formTitle}
            </h2>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t.booking.formSubtitle}
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus.type && (
          <div className="mx-8 mt-8">
            <div
              className={`rounded-2xl border p-5 ${
                submitStatus.type === "success"
                  ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20"
                  : "border-red-200 bg-gradient-to-r from-red-50 to-rose-50 dark:border-red-800 dark:from-red-900/20 dark:to-rose-900/20"
              }`}
              role="alert"
            >
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="text-3xl">
                  {submitStatus.type === "success" ? "✓" : "⚠"}
                </span>
                <p
                  className={`text-base font-semibold ${
                    submitStatus.type === "success"
                      ? "text-green-900 dark:text-green-200"
                      : "text-red-900 dark:text-red-200"
                  }`}
                >
                  {submitStatus.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="space-y-8 p-8" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">👤</span>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                isRequired
                classNames={{
                  input: "text-base",
                  label: "text-sm font-medium",
                }}
                errorMessage={errors.fullName}
                isInvalid={!!errors.fullName}
                label="Full Name"
                name="fullName"
                placeholder=""
                radius="lg"
                type="text"
                value={formData.fullName}
                variant="bordered"
                onChange={handleInputChange}
              />
              <Input
                isRequired
                classNames={{
                  input: "text-base",
                  label: "text-sm font-medium",
                }}
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                label="Email Address"
                name="email"
                placeholder=""
                radius="lg"
                type="email"
                value={formData.email}
                variant="bordered"
                onChange={handleInputChange}
              />
            </div>
            <Input
              isRequired
              classNames={{
                input: "text-base",
                label: "text-sm font-medium",
              }}
              errorMessage={errors.phone}
              isInvalid={!!errors.phone}
              label="Phone Number"
              name="phone"
              placeholder=""
              radius="lg"
              type="tel"
              value={formData.phone}
              variant="bordered"
              onChange={handleInputChange}
            />
          </div>

          {/* Trip Details */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">📍</span>
              Trip Details
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <Input
                isRequired
                classNames={{
                  input: "text-base",
                  label: "text-sm font-medium",
                }}
                errorMessage={errors.pickupLocation}
                isInvalid={!!errors.pickupLocation}
                label="Pickup Location"
                name="pickupLocation"
                placeholder=""
                radius="lg"
                startContent={<span className="text-green-600">●</span>}
                type="text"
                value={formData.pickupLocation}
                variant="bordered"
                onChange={handleInputChange}
              />
              <Input
                isRequired
                classNames={{
                  input: "text-base",
                  label: "text-sm font-medium",
                }}
                errorMessage={errors.dropoffLocation}
                isInvalid={!!errors.dropoffLocation}
                label="Drop-off Location"
                name="dropoffLocation"
                placeholder=""
                radius="lg"
                startContent={<span className="text-red-600">●</span>}
                type="text"
                value={formData.dropoffLocation}
                variant="bordered"
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Vehicle & Schedule */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">🚗</span>
              Vehicle & Schedule
            </h3>
            <Select
              isRequired
              classNames={{
                label: "text-sm font-medium",
                value: "text-base",
              }}
              errorMessage={errors.vehicleType}
              isInvalid={!!errors.vehicleType}
              label="Vehicle Type"
              placeholder=""
              radius="lg"
              selectedKeys={formData.vehicleType ? [formData.vehicleType] : []}
              variant="bordered"
              onChange={(e) => handleSelectChange(e.target.value)}
            >
              {vehicleTypes.map((vehicle) => (
                <SelectItem key={vehicle.key}>{vehicle.label}</SelectItem>
              ))}
            </Select>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Input
                isRequired
                classNames={{
                  input: "text-base",
                  label: "text-sm font-medium",
                }}
                errorMessage={errors.scheduledDate}
                isInvalid={!!errors.scheduledDate}
                label=""
                min={getTodayDate()}
                name="scheduledDate"
                radius="lg"
                type="date"
                value={formData.scheduledDate}
                variant="bordered"
                onChange={handleInputChange}
              />
              <Input
                isRequired
                classNames={{
                  input: "text-base",
                  label: "text-sm font-medium",
                }}
                errorMessage={errors.scheduledTime}
                isInvalid={!!errors.scheduledTime}
                label=""
                name="scheduledTime"
                radius="lg"
                type="time"
                value={formData.scheduledTime}
                variant="bordered"
                onChange={handleInputChange}
              />
              <Input
                isRequired
                classNames={{
                  input: "text-base",
                  label: "text-sm font-medium",
                }}
                errorMessage={errors.passengerCount}
                isInvalid={!!errors.passengerCount}
                label="Passengers"
                max="8"
                min="1"
                name="passengerCount"
                radius="lg"
                type="number"
                value={formData.passengerCount}
                variant="bordered"
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">📝</span>
              Additional Information
            </h3>
            <Textarea
              classNames={{
                input: "text-base",
                label: "text-sm font-medium",
              }}
              label="Special Requests"
              maxLength={500}
              name="specialRequests"
              placeholder="Any special requirements..."
              radius="lg"
              value={formData.specialRequests}
              variant="bordered"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialRequests: e.target.value,
                }))
              }
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              className="h-14 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              radius="lg"
              size="lg"
              type="submit"
            >
              {isSubmitting ? "Processing..." : "Confirm Booking"}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200/50 bg-gray-50/50 px-8 py-6 dark:border-gray-800/50 dark:bg-gray-900/50">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            By confirming, you agree to our{" "}
            <a
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              href="/terms"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              href="/privacy"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
