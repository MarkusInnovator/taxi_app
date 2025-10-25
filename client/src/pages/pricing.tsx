import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function PricingPage() {
  const pricingData = [
    { route: "Stadtfahrten (Grundpreis)", price: "3,50 €" },
    { route: "Pro Kilometer", price: "2,20 €" },
    { route: "Wartezeit pro Stunde", price: "35,00 €" },
    { route: "Flughafen Frankfurt", price: "ab 85,00 €" },
    { route: "Großraumtaxi Zuschlag", price: "15,00 €" },
    { route: "Nachtfahrten (22-06 Uhr)", price: "+25%" },
  ];

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center justify-center">
          <h1 className={title()}>Preise</h1>
          <p className="mt-4 mb-8 text-gray-600">
            Transparente Preise ohne versteckte Kosten
          </p>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-yellow-500 text-white">
                <tr>
                  <th className="px-6 py-4">Leistung</th>
                  <th className="px-6 py-4 text-right">Preis</th>
                </tr>
              </thead>
              <tbody>
                {pricingData.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4">{item.route}</td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            * Alle Preise sind Richtwerte. Genaue Preise auf Anfrage.
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
