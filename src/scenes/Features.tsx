import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";

type Feature = {
  title: string;
  img: string;
  alt: string;
  body: ReactNode;
};

const features: Feature[] = [
  {
    title: "Connect a Service",
    img: "/shots/services.png",
    alt: "Billing platforms Subscriptix connects to: Stripe, Chargebee, Recurly, RevenueCat and Paddle",
    body: (
      <>
        <strong>
          Link your account and import data directly from most major billing
          platforms.
        </strong>{" "}
        Subscriptix gathers your transaction history and keeps your models
        up-to-date with ongoing, automatic syncing.
      </>
    ),
  },
  {
    title: "Import Files",
    img: "/shots/file-import.png",
    alt: "A transaction log CSV recognized and its columns mapped to the ledger",
    body: (
      <>
        If your data lives in CSVs or spreadsheets,
        Subscriptix's machine learning and AI tools can{" "}
        <strong>
          analyze and parse nearly any table format, mapping every column and
          routing data to where it belongs
        </strong>
        .
      </>
    ),
  },
  {
    title: "Split & Classify",
    img: "/shots/parse-data.png",
    alt: "Routing data to models and classifying 48 subscription lapses as win-backs",
    body: (
      <>
        <strong>Split one data source into separate models by plan, channel or price.</strong>{" "}
        Subscriptix finds lapsed-and-returned customers, and{" "}
        you decide whether they're win-backs or new subscriptions.
      </>
    ),
  },
  {
    title: "Source Dashboard",
    img: "/shots/source-dashboard.png",
    alt: "A data source flowing through import channels into three target models",
    body: (
      <>
        See exactly how each data source feeds each model, and refresh it with a
        new file anytime.
      </>
    ),
  },
  {
    title: "Retention Modeling",
    img: "/shots/retention.png",
    alt: "Baseline and adjusted retention curves with confidence intervals",
    body: (
      <>
        Fitted retention curves with confidence intervals.
        Seasonal, age-based and cohort-specific adjustments. Promo pricing.
        Reactivated subscriptions.{" "}
        <strong>
          A suite of tools geared for subscription businesses that offer total,
          intuitive control of forecasts.
        </strong>
      </>
    ),
  },
  {
    title: "Compare",
    img: "/shots/compare.png",
    alt: "Two models' outputs open side by side",
    body: (
      <>
        Open up to four models side by side to compare
        scenarios, segments or price points.
      </>
    ),
  },
  {
    title: "Reports",
    img: "/shots/reports.png",
    alt: "An aggregated report combining two models' subscribers, cash and revenue by month",
    body: (
      <>
        Roll any set of models into one combined forecast: subscribers, revenue
        and cash, month by month.
      </>
    ),
  },
  {
    title: "Excel & Google Sheets",
    img: "/shots/excel.png",
    alt: "A Subscriptix model mirrored into an Excel workbook beside the add-in panel",
    body: (
      <>
        Echo your models in any spreadsheet.{" "}
        <strong>
          Subscriptix's plug-ins offer the full feature set, side-by-side with
          your platform of choice.
        </strong>{" "}
        Edit data in the spreadsheet or the app &mdash;{" "}
        changes instantly flow both ways.
      </>
    ),
  },
];

const at = (i: number) => ({ "--i": i }) as CSSProperties;

/* Swapping features: the old stage fades out (same as a scene change) while
   the rail holds still; the new stage's cards drift in on remount. The
   `stage-swap` class keeps the whole scene from fading along with it. */
function swap(update: () => void) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced) {
    update();
    return;
  }
  const root = document.documentElement;
  root.classList.add("stage-swap");
  const t = document.startViewTransition(() => flushSync(update));
  t.finished.finally(() => root.classList.remove("stage-swap"));
}

export default function Features() {
  const [active, setActive] = useState(0);

  const select = useCallback(
    (i: number) => {
      const next = (i + features.length) % features.length;
      if (next !== active) swap(() => setActive(next));
    },
    [active]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") select(active + 1);
      if (e.key === "ArrowLeft") select(active - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, select]);

  return (
    <div className="features">
      <nav className="features__rail" aria-label="Features">
        <p className="features__label card scene-card" style={at(0)}>
          Features
        </p>
        {features.map((f, i) => (
          <button
            key={f.title}
            type="button"
            onClick={() => select(i)}
            aria-current={i === active}
            className="features__item card scene-card"
            style={at(i + 1)}
          >
            {f.title}
          </button>
        ))}
      </nav>

      {/* Every feature's caption and screenshot is in the page (so the words
          are there for search engines), stacked in one spot: each card is
          sized by its tallest occupant, so switching features never resizes
          the stage and re-centres the scene. Only the selected one is visible
          (the rest are hidden from screen readers too). `key` remounts the
          cards on a switch, so they drift in again. */}
      <section className="features__stage" aria-label={features[active].title}>
        <div key={`text-${active}`} className="features__text card scene-card" style={at(1)}>
          {features.map((f, i) => (
            <p key={f.title} className="features__layer" aria-hidden={i !== active}>
              {f.body}
            </p>
          ))}
        </div>
        <figure key={`shot-${active}`} className="features__shot card scene-card" style={at(2)}>
          {features.map((f, i) => (
            <img
              key={f.title}
              className="features__layer"
              src={f.img}
              alt={i === active ? f.alt : ""}
              aria-hidden={i !== active}
            />
          ))}
        </figure>
      </section>
    </div>
  );
}
