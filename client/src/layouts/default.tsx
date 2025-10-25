import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-6 bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            © 2025 Taxi Mannheim - Alle Rechte vorbehalten
          </p>
          <div className="flex gap-4 justify-center text-sm">
            <Link className="text-gray-600 hover:text-yellow-600" href="#">
              Impressum
            </Link>
            <Link className="text-gray-600 hover:text-yellow-600" href="#">
              Datenschutz
            </Link>
            <Link className="text-gray-600 hover:text-yellow-600" href="#">
              AGB
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
