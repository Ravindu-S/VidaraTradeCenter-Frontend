import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>

            {/* Mobile Search */}
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors md:hidden">
              <span className="material-symbols-outlined">search</span>
            </button>

            {/* User / Login */}
            <Link
              to="/login"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-white"
            >
              <span className="material-symbols-outlined">person</span>
            </Link>

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