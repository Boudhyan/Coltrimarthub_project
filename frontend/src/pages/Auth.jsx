import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/Authslice.js";
import Loader from "../components/Loader";
import { Lock, UserRound, FlaskConical } from "lucide-react";

export default function Auth({ type }) {
  const [userdata, setData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({
      ...userdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const u = userdata.username.trim();
    const p = userdata.password;
    if (!u || !p) {
      toast.error("Enter username and password.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { username: u, password: p },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      dispatch(setCredentials(data));
      toast.success("Login successful!");
      navigate(data.full_access ? "/" : "/my-assignments");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      {/* Background */}
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
          <p className="mt-2 text-sm text-slate-400">
            {type === "login"
              ? "Sign in to access the lab dashboard"
              : "Create an account"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-md">
          <h2 className="text-center text-lg font-semibold text-slate-900">
            {type === "login" ? "Welcome back" : "Welcome"}
          </h2>
          <p className="mt-1 text-center text-sm text-slate-500">
            {type === "login"
              ? "Enter your credentials to continue"
              : "Fill in your details to get started"}
          </p>

          <form
            className={`mt-8 space-y-5 ${loading ? "pointer-events-none opacity-70" : ""}`}
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                <UserRound className="h-3.5 w-3.5" aria-hidden />
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={userdata.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Your username"
                className={inputClass}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                onChange={handleChange}
                value={userdata.password}
                required
                autoComplete="current-password"
                placeholder="••••••••"
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
                  Signing in…
                </>
              ) : type === "login" ? (
                "Sign in"
              ) : (
                "Signup"
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Secure access · Lab operations
        </p>
      </div>
    </div>
  );
}
