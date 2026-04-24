import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import { FlaskConical, Lock, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [validToken, setValidToken] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15";

  const validate = useCallback(async () => {
    if (!token || token.length < 10) {
      setValidToken(false);
      setChecking(false);
      return; 
      
    }
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/validate`,
        {
          params: { token },
          withCredentials: true,
        },
      );
      setValidToken(Boolean(data?.valid));
    } catch {
      setValidToken(false);
    } finally {
      setChecking(false);
    }
  }, [token]);

  useEffect(() => {
    validate();
  }, [validate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        { token, new_password: password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      toast.success("Password updated. You can sign in now.");
      navigate("/login", { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(
        typeof detail === "string" ? detail : "Could not reset password.",
      );
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
          <p className="mt-2 text-sm text-slate-400">Choose a new password</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-md">
          <Link
            to="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={18} aria-hidden />
            Back to sign in
          </Link>

          {checking ? (
            <div className="flex justify-center py-8">
              <Loader size={36} className="text-slate-700" />
            </div>
          ) : !validToken ? (
            <div className="space-y-4 text-center text-slate-700">
              <p className="text-sm">
                This reset link is invalid or has expired. Request a new one
                from the forgot password page.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block text-sm font-semibold text-slate-900 underline"
              >
                Forgot password
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-900">
                New password
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter a new password for your account.
              </p>

              <form
                className={`mt-6 space-y-5 ${loading ? "pointer-events-none opacity-70" : ""}`}
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    New password
                  </label>
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat password"
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
                      Saving…
                    </>
                  ) : (
                    "Update password"
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
