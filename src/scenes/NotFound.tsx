import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notice card scene-card">
      <h1>Nothing to see here.</h1>
      <p>
        The page you're looking for doesn't exist. It may have moved, or the
        link may be mistyped.
      </p>
      <Link to="/" viewTransition className="button-solid">
        <span aria-hidden="true">←</span> Back to Subscriptix
      </Link>
    </div>
  );
}
