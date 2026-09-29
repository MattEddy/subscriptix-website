import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

const at = (i: number) => ({ "--i": i }) as CSSProperties;

// Real capabilities, named the way people search for them.
const buzzwords = [
  "Cohort analysis",
  "Churn & retention curves",
  "Reactivation modeling",
  "Revenue & cash forecasting",
  "Scenario comparison",
  "AI data parsing",
  "Live billing sync",
  "Two-way spreadsheet sync",
];

export default function Welcome() {
  return (
    <div className="welcome">
      <div className="welcome__hero card scene-card" style={at(0)}>
        <h1>
          Powerful <strong>financial modeling and analytics</strong>
          <br />
          engineered for <strong>subscription businesses.</strong>
        </h1>
      </div>

      <div className="welcome__row">
        <div className="welcome__sheets card scene-card" style={at(1)}>
          <p>
            Create <strong>supercharged models</strong> far beyond what
            spreadsheets can handle&nbsp;— that work directly in Excel or Google
            Sheets.
          </p>
          <Link
            to="/features"
            viewTransition
            className="welcome__more button-solid"
          >
            Learn More <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="welcome__buzz card scene-card" style={at(3)}>
          {buzzwords.map((w, i) => (
            <li key={w}>
              {w}
              {i < buzzwords.length - 1 && <span aria-hidden="true"> ·</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="welcome__steps card scene-card" style={at(2)}>
        <p>
          Connect to your data.
          <br />
          Generate a forecast.
          <br />
          <strong>In seconds.</strong>
        </p>
      </div>
    </div>
  );
}
