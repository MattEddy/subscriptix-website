import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

// The mark's breathing is keyed to the clock rather than to page load, so it
// is at the same point in its cycle on every page — including the app's
// sign-in page, which uses the same 40 s cycle (20 s each way, alternating).
// A negative delay starts the animation part-way through.
const MARK_CYCLE_S = 40;
const markPhase = { animationDelay: `-${(Date.now() / 1000) % MARK_CYCLE_S}s` };

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <img src="/mark.svg" alt="" aria-hidden="true" className="bg-mark" style={markPhase} />
      <Header />
      <main className="scene flex-1 flex items-center justify-center px-4 pt-6 pb-10 md:pt-28 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
