import { Route, Routes } from "react-router-dom";

import { LanguageProvider } from "@/contexts/LanguageContext";
import AboutPage from "@/pages/about";
import BookingPage from "@/pages/booking";
import DocsPage from "@/pages/docs";
import IndexPage from "@/pages/index";
import PricingPage from "@/pages/pricing";

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<DocsPage />} path="/docs" />
        <Route element={<PricingPage />} path="/pricing" />
        <Route element={<BookingPage />} path="/booking" />
        <Route element={<AboutPage />} path="/about" />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
