import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* Section 1 */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
              Financial modeling and analytics for subscription businesses.
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Easily build powerful, robust and fully-modifiable cohort-based
              forecasting models from scratch.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Or supercharge your existing models with features far beyond what
              Excel can handle.
            </p>
          </div>
          <div>
            <img
              src="/screenshot-app.png"
              alt="Subscriptix app showing cohort retention curves and adjustments"
              className="rounded-xl shadow-2xl border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <img
              src="/screenshot-parameters.png"
              alt="Subscriptix parameters panel"
              className="w-3/5 rounded-xl shadow-2xl border border-gray-200"
            />
            <div className="text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                Comprehensive data control and reporting features.
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Generate models based on your historical subscriber retention
                data, then customize them with powerful, easy-to-use tools like
                seasonality adjustments and universal cohort modifiers.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Quickly create different models for different future scenarios,
                then use aggregated reporting to easily perform comparative
                analyses.
              </p>
              <img
                src="/screenshot-aggregation.png"
                alt="Subscriptix model aggregation"
                className="mt-12 rounded-xl shadow-2xl border border-gray-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
              Full Excel integration.
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Use the add-in to deploy all of Subscriptix' features directly in
              Excel, and seamlessly supercharge the spreadsheet-based models
              you've already created.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              All data is securely cloud-stored, ensuring perfect continuity
              between the add-in and web app.
            </p>
          </div>
          <div>
            <img
              src="/screenshot-excel.png"
              alt="Subscriptix Excel add-in showing cohort data and download options"
              className="rounded-xl shadow-2xl border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-14 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Ready to transform your subscription forecasting?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We're working with design partners to hone the Subscriptix
            experience. Schedule a demo today.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center px-8 py-3.5 rounded-xl bg-brand-600 text-white font-semibold text-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}

