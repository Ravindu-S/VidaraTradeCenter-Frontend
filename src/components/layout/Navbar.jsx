<<<<<<< Updated upstream
=======
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-12">
        {/* Left side: Logo + Nav */}
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-xl">layers</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-primary dark:text-slate-100 uppercase">
              Vidara
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/products"
              className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              Shop All
            </Link>
            <Link
              to="/products?sort=newest"
              className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              New Arrivals
            </Link>
            <Link
              to="/products?sort=popular"
              className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              Best Sellers
            </Link>
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              About
            </a>
          </nav>
        </div>

        {/* Right side: Search + Icons */}
        <div className="flex items-center gap-4">
          {/* Desktop Search */}
          <div className="hidden lg:flex items-center">
            <label className="relative block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-slate-400 text-sm">
                  search
                </span>
              </span>
              <input
                className="h-10 w-64 rounded-lg border-none bg-slate-100 pl-10 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-white"
                placeholder="Find products..."
                type="text"
              />
            </label>
          </div>

          {/* Icon Buttons */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Search */}
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors md:hidden">
              <span className="material-symbols-outlined">search</span>
            </button>

            {/* User / Login */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold"
                >
                  {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">person</span>
                      My Profile
                    </Link>
                    <Link
                      to="/profile/addresses"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">location_on</span>
                      My Addresses
                    </Link>
                    {(user?.role === "ADMIN" || user?.roles?.includes("ADMIN")) && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-white"
              >
                <span className="material-symbols-outlined">person</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark md:hidden">
          <nav className="mx-auto max-w-[1280px] flex flex-col gap-1 px-6 py-4">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            >
              Shop All
            </Link>
            <Link
              to="/products?sort=newest"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            >
              New Arrivals
            </Link>
            <Link
              to="/products?sort=popular"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            >
              Best Sellers
            </Link>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            >
              About
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
>>>>>>> Stashed changes
