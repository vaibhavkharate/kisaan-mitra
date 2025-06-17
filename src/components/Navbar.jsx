// Navbar.jsx
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bg-green-700 px-4 py-3 text-white shadow flex justify-between items-center">
      <h1 className="text-lg font-bold">🌾 Kisaan Mitra</h1>
      <div className="flex gap-4 text-sm">
        <Link
          to="/"
          className={`hover:underline ${
            pathname === "/" ? "underline font-bold" : ""
          }`}
        >
          Weather
        </Link>
        <Link
          to="/recommend"
          className={`hover:underline ${
            pathname === "/recommend" ? "underline font-bold" : ""
          }`}
        >
          Crop Recommendation
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
