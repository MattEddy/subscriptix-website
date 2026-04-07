export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              Subscriptix
            </h3>
            <p className="text-sm">
              Contact Us:{" "}
              <a
                href="mailto:info@subscriptix.com"
                className="text-brand-400 hover:text-brand-200 transition-colors"
              >
                info@subscriptix.com
              </a>
            </p>
          </div>
          <a
            href="https://www.linkedin.com/company/subscriptix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Subscriptix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
