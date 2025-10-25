import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function AboutPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Über Uns</h1>
          <div className="mt-8 text-left">
            <p className="mb-4">
              Willkommen bei Taxi Mannheim - Ihrem zuverlässigen Partner für
              Personen- und Gütertransport in Mannheim und Umgebung.
            </p>
            <p className="mb-4">
              Seit vielen Jahren bieten wir professionelle Taxidienstleistungen
              mit modernen Fahrzeugen und erfahrenen Fahrern. Ihr Komfort und
              Ihre Sicherheit stehen für uns an erster Stelle.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-2">Unsere Vorteile:</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>24/7 Verfügbarkeit</li>
              <li>Feste und transparente Preise</li>
              <li>Moderne und gepflegte Fahrzeugflotte</li>
              <li>Erfahrene und freundliche Fahrer</li>
              <li>Bargeld- und Kartenzahlung möglich</li>
            </ul>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
