import { useDispatch } from "react-redux";
import { logout } from "../store/slices/Authslice.js";

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900 transition cursor-pointer"
    >
      Logout
    </button>
  );
}
