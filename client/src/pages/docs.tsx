import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center justify-center">
          <h1 className={title()}>Dokumentation</h1>
          <div className="mt-8 text-left space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-3">
                Wie buche ich ein Taxi?
              </h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Gehen Sie zur Buchungsseite</li>
                <li>Füllen Sie das Formular mit Ihren Daten aus</li>
                <li>Wählen Sie Datum und Uhrzeit</li>
                <li>Senden Sie die Anfrage ab</li>
                <li>Wir bestätigen Ihre Buchung innerhalb von 5 Minuten</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Zahlungsmethoden</h2>
              <p>Wir akzeptieren:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Bargeld</li>
                <li>EC-Karte</li>
                <li>Kreditkarte (Visa, Mastercard)</li>
                <li>Firmenkonto (nach Vereinbarung)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">
                Stornierungsbedingungen
              </h2>
              <p>
                Kostenlose Stornierung bis 2 Stunden vor der gebuchten
                Abholzeit. Bei kurzfristigeren Stornierungen behalten wir uns
                vor, eine Stornogebühr von 15 € zu berechnen.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Kontakt & Support</h2>
              <p>
                Bei Fragen erreichen Sie uns telefonisch unter{" "}
                <a
                  className="text-yellow-600 hover:underline"
                  href="tel:+49123456789"
                >
                  +49 123 456 789
                </a>{" "}
                oder per E-Mail an{" "}
                <a
                  className="text-yellow-600 hover:underline"
                  href="mailto:info@taxiviernheim.de"
                >
                  info@taxiviernheim.de
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
