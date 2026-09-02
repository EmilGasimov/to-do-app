import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { forgotPassword } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const msg = await forgotPassword(email);
      setMessage(msg);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth">
      <header className="auth__header">
        <h1 className="auth__title">forgot password</h1>
      </header>

      <div className="auth__card">
        {message ? (
          <p>{message}</p>
        ) : (
          <form className="auth__form" onSubmit={handleSubmit}>
            <input
              className={`auth__input${error ? " auth__input--error" : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <div className="auth__error">{error}</div>
            <button className="auth__btn" type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}
      </div>

      <p className="auth__footer">
        <Link className="auth__link" to="/login">Back to log in</Link>
      </p>
    </div>
  );
}