import { Link } from "react-router-dom";

export default function Pricing() {
  return (
    <div className="pricing card scene-card">
      <h1>Subscriptix is currently by invitation only.</h1>
      <p>If you think it might be a fit for your business, we'd love to connect.</p>
      <p>Please reach out to learn more or schedule a demo.</p>
      <Link to="/contact" viewTransition className="button-solid">
        Contact Us
      </Link>
    </div>
  );
}
