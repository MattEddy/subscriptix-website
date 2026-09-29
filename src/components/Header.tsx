import { useEffect, type MouseEvent } from "react";
import { Link, NavLink } from "react-router-dom";

const scenes = [
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact Us" },
];

const LOGIN_URL = "https://app.subscriptix.com/login/?next=/";

// The app lives on another site, so a real cross-page transition isn't
// possible. Instead the scene fades out the way it does between scenes, then
// we navigate, and the sign-in card drifts in on the other side.
function leaveForLogin(e: MouseEvent<HTMLAnchorElement>) {
  const newTab = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (newTab || reduced) return;
  e.preventDefault();
  document.documentElement.classList.add("leaving");
  setTimeout(() => window.location.assign(LOGIN_URL), 300);
}

export default function Header() {
  // Back from the sign-in page can restore this page exactly as it was left —
  // faded out. Clear the fade whenever the page is shown again.
  useEffect(() => {
    const clear = () => document.documentElement.classList.remove("leaving");
    window.addEventListener("pageshow", clear);
    return () => window.removeEventListener("pageshow", clear);
  }, []);

  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 md:fixed md:inset-x-0 md:top-0">
      <Link to="/" viewTransition className="card px-[18px] py-3">
        <img src="/logo.png" alt="Subscriptix" className="h-10 md:h-[51px] w-auto" />
      </Link>
      <nav className="card flex max-w-full items-center gap-1 overflow-x-auto p-1.5">
        {scenes.map((s) => (
          <NavLink
            key={s.to}
            to={s.to}
            end
            viewTransition
            className={({ isActive }) =>
              `whitespace-nowrap px-2.5 md:px-3.5 py-2 rounded-lg text-sm md:text-[15px] font-semibold transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`
            }
          >
            {s.label}
          </NavLink>
        ))}
        <a
          href={LOGIN_URL}
          onClick={leaveForLogin}
          className="ml-1 whitespace-nowrap px-3 md:px-4 py-2 rounded-lg text-sm md:text-[15px] font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
        >
          Login
        </a>
      </nav>
    </header>
  );
}
