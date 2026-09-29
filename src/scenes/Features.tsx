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
    title: "Connect a service",
    img: "/features/services.png",
    alt: "Billing platforms Subscriptix connects to: Stripe, Chargebee, Recurly, RevenueCat and Paddle",
    body: (
      <>
        Connect <strong>your billing platform</strong>. Your transaction history
        flows in and stays in sync automatically.
      </>
    ),
  },
  {
    title: "Import a file",
    img: "/features/file-import.png",
    alt: "A transaction log CSV recognized and its columns mapped to the ledger",
    body: (
      <>
        Drop in a CSV or spreadsheet. Whether a raw transaction log, a
        custom-generated cohort table, or something else entirely,{" "}
        <strong>
          AI-powered parsers recognize what kind of data it is and map every
          column
        </strong>
        .
      </>
    ),
  },
  {
    title: "Split & classify",
    img: "/features/parse-data.png",
    alt: "Routing data to models and classifying 48 subscription lapses as win-backs",
    body: (
      <>
        Split one data source into separate models by plan, channel or price.
        Subscriptix finds lapsed-and-returned customers, and{" "}
        <strong>you decide whether they're win-backs or new customers.</strong>
      </>
    ),
  },
  {
    title: "Source dashboard",
    img: "/features/source-dashboard.png",
    alt: "A data source flowing through import channels into three target models",
    body: (
      <>
        See exactly how each data source feeds each model (fields, groups and
        destinations), and refresh it with a new file anytime.
      </>
    ),
  },
  {
    title: "Retention modeling",
    img: "/features/retention.png",
    alt: "Baseline and adjusted retention curves with confidence intervals",
    body: (
      <>
        Fitted retention curves with confidence intervals. Shape them with{" "}
        <strong>age-based and cohort-specific adjustments</strong>, and the whole
        model recalculates.
      </>
    ),
  },
  {
    title: "Compare",
    img: "/features/compare.png",
    alt: "Two models' outputs open side by side",
    body: (
      <>
        Open up to <strong>four models side by side</strong> to compare
        scenarios, segments or price points.
      </>
    ),
  },
  {
    title: "Reports",
    img: "/features/reports.png",
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
    img: "/features/excel.png",
    alt: "A Subscriptix model mirrored into an Excel workbook beside the add-in panel",
    body: (
      <>
        Your model lives inside Excel or Google Sheets.{" "}
        <strong>Edit in the spreadsheet or in the app, and changes flow both ways.</strong>
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
  const feature = features[active];

  const select = useCallback(
    (i: number) => {
      const next = (i + features.length) % features.length;
      if (next !== active) swap(() => setActive(next));
    },
    [active]
  );

  // Warm the cache so a swap never waits on an image.
  useEffect(() => {
    features.forEach((f) => {
      new Image().src = f.img;
    });
  }, []);

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

      <div key={active} className="features__stage">
        <figure className="features__shot card scene-card" style={at(1)}>
          <img src={feature.img} alt={feature.alt} />
        </figure>
        <div className="features__text card scene-card" style={at(2)}>
          <p>{feature.body}</p>
        </div>
      </div>
    </div>
  );
}
