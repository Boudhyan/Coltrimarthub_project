import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/Authslice.js";
import Loader from "./Loader";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    if (loading) return;
    setLoading(true);
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex min-h-[40px] min-w-[5.5rem] cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-80"
    >
      {loading ? (
        <>
          <Loader size={18} className="text-white" />
          Signing out…
        </>
      ) : (
        "Logout"
      )}
    </button>
  );
}
