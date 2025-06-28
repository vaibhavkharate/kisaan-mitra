import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const navItems = [
    { name: t("weather"), path: "/" },
    { name: t("crop_recommendation"), path: "/recommend" },
    { name: t("mandi_prices"), path: "/mandiPrices" },
    { name: t("schemes"), path: "/schemes" },
    { name: t("news"), path: "/news" },
    { name: t("contact"), path: "/contact" },
  ];

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          Kisaan Mitra 🌾
        </Link>
        <Link to="/register" className="hover:text-yellow-300 transition duration-200">
          Register
        </Link>

        {/* Language Switcher */}
        <select
          value={i18n.language}
          onChange={handleLanguageChange}
          className="bg-white text-black px-2 py-1 rounded focus:outline-none"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="mr">मराठी</option>
        </select>

        {/* Hamburger Menu Button */}
        <button
          className="lg:hidden focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="hover:text-yellow-300 transition duration-200"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="lg:hidden px-4 pb-4 space-y-2 bg-green-700 text-sm">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="block py-2 border-b border-green-500 hover:text-yellow-300"
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
