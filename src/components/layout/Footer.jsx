import React from "react";
import { Link } from "react-router-dom";

const shopLinks = [
  { label: "Lighting", to: "/products" },
  { label: "Organization", to: "/products" },
  { label: "Tech Accessories", to: "/products" },
  { label: "Stationery", to: "/products" },
];

const supportLinks = [
  { label: "Shipping", to: "/support/shipping" },
  { label: "Returns", to: "/support/returns" },
  { label: "Contact Us", to: "/support/contact" },
  { label: "FAQ", to: "/support/faq" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/legal/privacy-policy" },
  { label: "Terms of Service", to: "/legal/terms-of-service" },
];

const FooterLinkColumn = ({ title, links }) => {
  return (
    <div>
      <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
        {title}
      </h4>
      <ul className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="hover:text-primary dark:hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-background-dark">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-6 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white">
                <span className="material-symbols-outlined text-sm">layers</span>
              </div>
              <span className="text-lg font-bold uppercase tracking-tight text-primary dark:text-white">
                Vidara
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Modern essentials for the ambitious professional.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
                aria-label="Share"
              >
                <span className="material-symbols-outlined">share</span>
              </button>
              <button
                type="button"
                className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
                aria-label="Email"
              >
                <span className="material-symbols-outlined">mail</span>
              </button>
            </div>
          </div>

          <FooterLinkColumn title="Shop" links={shopLinks} />
          <FooterLinkColumn title="Support" links={supportLinks} />
          <FooterLinkColumn title="Legal" links={legalLinks} />
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8 text-center text-xs text-slate-400 dark:border-slate-800">
          Copyright {new Date().getFullYear()} Vidara International. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
