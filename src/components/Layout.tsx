import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <img src="/mark.svg" alt="" aria-hidden="true" className="bg-mark" />
      <Header />
      <main className="scene flex-1 flex items-center justify-center px-4 pt-6 pb-10 md:pt-28 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
