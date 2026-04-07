import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/">
          <img src="/logo.png" alt="Subscriptix" className="h-8" />
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/contact"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Learn More
          </Link>
          <a
            href="https://app.subscriptix.com/login/?next=/"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
