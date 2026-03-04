import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-background-dark">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {/* Brand Column */}
          <div className="col-span-2 flex flex-col gap-6 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white">
                <span className="material-symbols-outlined text-sm">
                  layers
                </span>
              </div>
              <span className="text-lg font-bold uppercase tracking-tight text-primary dark:text-white">
                Vidara
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Modern essentials for the ambitious professional.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">share</span>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">mail</span>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              Shop
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  Lighting
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  Organization
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  Tech Accessories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  Stationery
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              Support
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  Shipping
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              Legal
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-slate-100 pt-8 text-center text-xs text-slate-400 dark:border-slate-800">
          © {new Date().getFullYear()} Vidara International. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;