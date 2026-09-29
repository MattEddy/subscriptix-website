export default function Footer() {
  return (
    <footer className="relative z-10 pb-6 text-center text-[13px] text-gray-500">
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
      &copy; {new Date().getFullYear()} Subscriptix
    </footer>
  );
}
