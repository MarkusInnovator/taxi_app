import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

interface PricingItem {
  id: string;
  service: string;
  price: string;
  description?: string;
}

const PRICING_DATA: readonly PricingItem[] = [
  {
    id: "base-fare",
    service: "City Rides (Base Fare)",
    price: "€3.50",
    description: "Initial charge for all city trips",
  },
  {
    id: "per-km",
    service: "Per Kilometer",
    price: "€2.20",
    description: "Standard rate per kilometer",
  },
  {
    id: "waiting-time",
    service: "Waiting Time",
    price: "€35.00/hr",
    description: "Charged when vehicle is idle",
  },
  {
    id: "airport-transfer",
    service: "Frankfurt Airport Transfer",
    price: "from €85.00",
    description: "Fixed rate airport service",
  },
  {
    id: "large-vehicle",
    service: "Large Vehicle Surcharge",
    price: "€15.00",
    description: "Additional fee for vans",
  },
  {
    id: "night-rides",
    service: "Night Rides (10 PM - 6 AM)",
    price: "+25%",
    description: "Surcharge for overnight trips",
  },
] as const;

export default function PricingPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-16 py-8 md:py-12 px-4">
        {/* Header */}
        <section className="flex flex-col items-center justify-center gap-4 text-center max-w-4xl mx-auto">
          <h1 className={title()}>Pricing</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Transparent pricing with no hidden fees
          </p>
        </section>

        {/* Pricing Table */}
        <section className="max-w-5xl mx-auto w-full">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {PRICING_DATA.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`
                        transition-colors duration-150
                        ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-50 dark:bg-gray-900/50"
                        }
                        hover:bg-gray-50 dark:hover:bg-gray-800/50
                      `}
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-white text-base">
                            {item.service}
                          </span>
                          {item.description && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          {item.price}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 space-y-3 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              * All prices are estimates. Exact rates available upon request.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Contact us for corporate accounts and special rates.
            </p>
          </div>
        </section>

        {/* Additional Info */}
        <section className="max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Methods
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Cash
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Debit Cards
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Credit Cards
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Corporate Accounts
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Special Offers
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">★</span> Corporate discounts
                  available
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">★</span> Regular customer
                  benefits
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">★</span> Airport packages
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">★</span> Volume discounts
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
