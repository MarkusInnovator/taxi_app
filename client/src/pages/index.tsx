import { Link } from "react-router-dom";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="font-sans text-gray-900">
        {/* Hero Section */}
        <section className="bg-yellow-500 text-white py-20 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🚖 Taxi Mannheim – Schnell & Zuverlässig
          </h1>
          <p className="text-lg md:text-xl mb-6">
            24/7 erreichbar · Feste Preise · Kartenzahlung möglich
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              className="bg-white text-yellow-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100"
              to="/booking"
            >
              Jetzt Fahrt buchen
            </Link>
            <a
              className="bg-transparent border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-yellow-600"
              href="tel:+49123456789"
            >
              Anrufen
            </a>
          </div>
        </section>

        {/* Leistungen */}
        <section className="py-16 px-6 bg-gray-100">
          <h2 className="text-3xl font-bold text-center mb-10">
            Unsere Leistungen
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              ["Flughafentransfer", "✈️"],
              ["Krankentransport", "🏥"],
              ["Großraumtaxi", "🚐"],
              ["Kurierdienste", "📦"],
              ["Firmenfahrten", "🏢"],
              ["Stadtfahrten", "🚕"],
            ].map(([title, icon]) => (
              <div
                key={title}
                className="bg-white p-6 rounded-lg shadow text-center"
              >
                <div className="text-4xl mb-2">{icon}</div>
                <h3 className="text-xl font-semibold">{title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Kontakt */}
        <section className="py-16 px-6 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4">Kontakt aufnehmen</h2>
          <p className="mb-6">Wir sind rund um die Uhr für Sie da</p>
          <div className="flex justify-center gap-6 flex-wrap text-lg">
            <a
              className="text-yellow-600 hover:underline"
              href="tel:+49123456789"
            >
              📞 +49 123 456 789
            </a>
            <a
              className="text-yellow-600 hover:underline"
              href="mailto:info@taxiviernheim.de"
            >
              📧 info@taxiviernheim.de
            </a>
            <a
              className="text-yellow-600 hover:underline"
              href="https://wa.me/49123456789"
              rel="noreferrer"
              target="_blank"
            >
              💬 WhatsApp
            </a>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
