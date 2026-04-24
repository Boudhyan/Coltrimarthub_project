import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { FlaskConical, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [smtpConfigured, setSmtpConfigured] = useState(true);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Enter a valid email address");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email: trimmed },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      setSmtpConfigured(data?.smtp_configured !== false);
      setSubmitted(true);
      if (data?.smtp_configured === false) {
        toast.success("Request received.");
      } else {
        toast.success("Check your email for the next steps.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(71,85,105,0.35),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(15,23,42,0.9))]"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow-lg ring-1 ring-white/20 backdrop-blur-sm">
            <FlaskConical className="h-8 w-8 text-white" strokeWidth={1.75} aria-hidden />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Planet Electro Labs
          </h1>
          <p className="mt-2 text-sm text-slate-400">Reset your password</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-md">
          <Link
            to="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={18} aria-hidden />
            Back to sign in
          </Link>

          {submitted ? (
            <div className="space-y-3 text-center text-slate-700">
              <p className="text-sm leading-relaxed">
                If an account exists for that email, we&apos;ve sent instructions
                to reset your password. The link expires in one hour.
              </p>
              {!smtpConfigured ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs text-amber-900">
                  <strong className="font-semibold">Email not sent from this server.</strong>{" "}
                  The administrator must set{" "}
                  <code className="rounded bg-amber-100/80 px-1">SMTP_HOST</code> and related
                  variables on the backend (see <code className="rounded bg-amber-100/80 px-1">backend/.env.example</code>
                  ). For local testing, enable{" "}
                  <code className="rounded bg-amber-100/80 px-1">LOG_PASSWORD_RESET_LINK=true</code>{" "}
                  and copy the reset URL from the API server log.
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Didn&apos;t get it? Check spam or request again.
                </p>
              )}
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-900">
                Forgot password
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the email address for your account. We&apos;ll send a
                reset link if it exists.
              </p>

              <form
                className={`mt-6 space-y-5 ${loading ? "pointer-events-none opacity-70" : ""}`}
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader size={22} className="text-white" />
                      Sending…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Secure access · Lab operations
        </p>
      </div>
    </div>
  );
}
