/**
 * Translation strings for all supported languages
 */

export interface Translations {
  readonly nav: {
    readonly home: string;
    readonly about: string;
    readonly pricing: string;
    readonly docs: string;
    readonly booking: string;
  };
  readonly home: {
    readonly title: string;
    readonly subtitle: string;
    readonly bookNow: string;
    readonly callNow: string;
  };
  readonly booking: {
    readonly pageTitle: string;
    readonly pageSubtitle: string;
    readonly formTitle: string;
    readonly formSubtitle: string;
    readonly personalInfo: string;
    readonly tripDetails: string;
    readonly vehicleSchedule: string;
    readonly additionalInfo: string;
    readonly fields: {
      readonly name: string;
      readonly namePlaceholder: string;
      readonly email: string;
      readonly emailPlaceholder: string;
      readonly phone: string;
      readonly phonePlaceholder: string;
      readonly pickup: string;
      readonly pickupPlaceholder: string;
      readonly dropoff: string;
      readonly dropoffPlaceholder: string;
      readonly vehicleType: string;
      readonly vehicleTypePlaceholder: string;
      readonly date: string;
      readonly time: string;
      readonly passengers: string;
      readonly notes: string;
      readonly notesPlaceholder: string;
    };
    readonly vehicleTypes: {
      readonly standard: string;
      readonly premium: string;
      readonly van: string;
      readonly luxury: string;
      readonly suv: string;
    };
    readonly submit: string;
    readonly submitting: string;
    readonly success: string;
    readonly error: string;
    readonly features: {
      readonly instant: {
        readonly title: string;
        readonly description: string;
      };
      readonly payment: {
        readonly title: string;
        readonly description: string;
      };
      readonly fleet: {
        readonly title: string;
        readonly description: string;
      };
    };
    readonly needHelp: string;
  };
}

export const translations: Record<"de" | "en", Translations> = {
  de: {
    nav: {
      home: "Startseite",
      about: "Über uns",
      pricing: "Preise",
      docs: "Infos",
      booking: "Jetzt buchen",
    },
    home: {
      title: "Professioneller Taxi-Service",
      subtitle:
        "Ihr zuverlässiger Partner für Stadtfahrten, Flughafentransfers & mehr",
      bookNow: "Jetzt buchen",
      callNow: "Jetzt anrufen",
    },
    booking: {
      pageTitle: "Reservieren Sie Ihre Fahrt",
      pageSubtitle: "Erleben Sie Premium-Transport mit nahtloser Buchung",
      formTitle: "Reservieren Sie Ihre Fahrt",
      formSubtitle:
        "Füllen Sie das Formular aus, um Ihren Premium-Transport zu buchen",
      personalInfo: "Persönliche Informationen",
      tripDetails: "Fahrtdetails",
      vehicleSchedule: "Fahrzeug & Zeitplan",
      additionalInfo: "Zusätzliche Informationen",
      fields: {
        name: "Vollständiger Name",
        namePlaceholder: "Geben Sie Ihren vollständigen Namen ein",
        email: "E-Mail-Adresse",
        emailPlaceholder: "ihre.email@beispiel.de",
        phone: "Telefonnummer",
        phonePlaceholder: "+49 123 456789",
        pickup: "Abholort",
        pickupPlaceholder: "Geben Sie die Abholadresse ein",
        dropoff: "Zielort",
        dropoffPlaceholder: "Geben Sie die Zieladresse ein",
        vehicleType: "Fahrzeugtyp",
        vehicleTypePlaceholder: "Wählen Sie einen Fahrzeugtyp",
        date: "Abholdatum",
        time: "Abholzeit",
        passengers: "Passagiere",
        notes: "Besondere Anforderungen",
        notesPlaceholder: "Alle besonderen Anforderungen...",
      },
      vehicleTypes: {
        standard: "Standard Limousine (1-4 Passagiere)",
        premium: "Premium Limousine (1-4 Passagiere)",
        van: "Van (5-8 Passagiere)",
        luxury: "Luxusfahrzeug (1-4 Passagiere)",
        suv: "SUV (1-6 Passagiere)",
      },
      submit: "Buchung bestätigen",
      submitting: "Wird verarbeitet...",
      success: "Buchung bestätigt! Wir kontaktieren Sie in Kürze.",
      error: "Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.",
      features: {
        instant: {
          title: "Sofortbestätigung",
          description: "Echtzeit-Buchungsstatus",
        },
        payment: {
          title: "Mehrere Zahlungsoptionen",
          description: "Bar, Karte & digitale Geldbörsen",
        },
        fleet: {
          title: "Premium-Flotte",
          description: "Moderne Fahrzeuge & erfahrene Fahrer",
        },
      },
      needHelp: "Benötigen Sie sofortige Unterstützung?",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      pricing: "Pricing",
      docs: "Docs",
      booking: "Book Now",
    },
    home: {
      title: "Professional Taxi Service",
      subtitle:
        "Your reliable partner for city rides, airport transfers & more",
      bookNow: "Book Now",
      callNow: "Call Now",
    },
    booking: {
      pageTitle: "Reserve Your Journey",
      pageSubtitle: "Experience premium transportation with seamless booking",
      formTitle: "Reserve Your Ride",
      formSubtitle:
        "Complete the form below to book your premium transportation",
      personalInfo: "Personal Information",
      tripDetails: "Trip Details",
      vehicleSchedule: "Vehicle & Schedule",
      additionalInfo: "Additional Information",
      fields: {
        name: "Full Name",
        namePlaceholder: "Enter your full name",
        email: "Email Address",
        emailPlaceholder: "your.email@example.com",
        phone: "Phone Number",
        phonePlaceholder: "+49 123 456789",
        pickup: "Pickup Location",
        pickupPlaceholder: "Enter pickup address",
        dropoff: "Drop-off Location",
        dropoffPlaceholder: "Enter destination address",
        vehicleType: "Vehicle Type",
        vehicleTypePlaceholder: "Select vehicle type",
        date: "Pickup Date",
        time: "Pickup Time",
        passengers: "Passengers",
        notes: "Special Requests",
        notesPlaceholder: "Any special requirements...",
      },
      vehicleTypes: {
        standard: "Standard Sedan (1-4 passengers)",
        premium: "Premium Sedan (1-4 passengers)",
        van: "Van (5-8 passengers)",
        luxury: "Luxury Vehicle (1-4 passengers)",
        suv: "SUV (1-6 passengers)",
      },
      submit: "Confirm Booking",
      submitting: "Processing...",
      success: "Booking confirmed! We'll contact you shortly.",
      error: "Booking failed. Please try again.",
      features: {
        instant: {
          title: "Instant Confirmation",
          description: "Real-time booking status",
        },
        payment: {
          title: "Multiple Payment Options",
          description: "Cash, card & digital wallets",
        },
        fleet: {
          title: "Premium Fleet",
          description: "Modern vehicles & expert drivers",
        },
      },
      needHelp: "Need immediate support?",
    },
  },
};
