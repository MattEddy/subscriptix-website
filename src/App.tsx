import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Welcome from "./scenes/Welcome";
import Features from "./scenes/Features";
import Pricing from "./scenes/Pricing";
import Contact from "./scenes/Contact";
import NotFound from "./scenes/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Welcome />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
