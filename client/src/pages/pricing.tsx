import { title } from "@/components/primitives";
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
      <section className="flex flex-col items-center justify-center gap-6 py-12 md:py-16">
        <div className="w-full max-w-5xl px-4">
          <div className="text-center mb-10">
            <h1 className={title()}>Pricing</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Transparent pricing with no hidden fees
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-yellow-500 to-yellow-600">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {PRICING_DATA.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`
                        transition-colors duration-150
                        ${
                          index % 2 === 0
                            ? "bg-gray-50 dark:bg-gray-900"
                            : "bg-white dark:bg-gray-800"
                        }
                        hover:bg-yellow-50 dark:hover:bg-yellow-900/20
                      `}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {item.service}
                          </span>
                          {item.description && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-bold text-yellow-600 dark:text-yellow-500">
                          {item.price}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              * All prices are estimates. Exact rates available upon request.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Contact us for corporate accounts and special rates.
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
