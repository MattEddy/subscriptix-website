import { useState, type FormEvent } from "react";

export default function LearnMore() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbytnchP_KcZb0wnBNhAb-t0HCdOHt7iV81JgVpvg72Ez1a3DkOdVAvs7WOYvZxvW-YUiA/exec",
        {
          method: "POST",
          body: JSON.stringify({ name, email }),
          mode: "no-cors",
        }
      );
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Learn More
        </h1>
        <div className="mt-6 text-lg text-gray-600 space-y-4">
          <p>
            We're currently working with design partners to hone the Subscriptix
            experience. If you think Subscriptix might be right for your
            business, we'd love to schedule a demo.
          </p>
          <p>
            Please reach out by emailing us directly at{" "}
            <a
              href="mailto:info@subscriptix.com"
              className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2"
            >
              info@subscriptix.com
            </a>{" "}
            or using the form below.
          </p>
        </div>

        {submitted ? (
          <div className="mt-10 p-8 rounded-2xl bg-green-50 border border-green-200 text-center">
            <p className="text-green-800 font-semibold text-lg">Thank you!</p>
            <p className="text-green-600 mt-1">We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-gray-900"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-gray-900"
                placeholder="you@company.com"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
