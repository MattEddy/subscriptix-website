// The same line as the app's sign-in footer (subscriptix repo,
// projection/components/auth_footer.html) — change one, change both.
export default function Footer() {
  return (
    <footer className="relative z-10 pb-6 text-center text-[13px] text-gray-600">
      <a href="mailto:info@subscriptix.com" className="hover:text-gray-800 transition-colors">
        info@subscriptix.com
      </a>
      <span className="mx-2.5">·</span>
      <a
        href="https://www.linkedin.com/company/subscriptix"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gray-800 transition-colors"
      >
        LinkedIn
      </a>
      <span className="mx-2.5">·</span>
      <a href="https://app.subscriptix.com/privacy/" className="hover:text-gray-800 transition-colors">
        Privacy Policy
      </a>
      <span className="mx-2.5">·</span>
      <a href="https://app.subscriptix.com/terms/" className="hover:text-gray-800 transition-colors">
        Terms of Service
      </a>
      <span className="mx-2.5">·</span>
      &copy; {new Date().getFullYear()} Sparrowstep LLC
    </footer>
  );
}
