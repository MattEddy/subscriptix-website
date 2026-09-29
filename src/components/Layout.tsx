import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { pageFor } from "../seo";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pageFor(pathname).title;
  }, [pathname]);

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
