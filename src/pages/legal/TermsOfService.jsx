import React from "react";
import InfoPage from "../common/InfoPage";

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By using this website, you agree to follow these terms and all applicable laws and regulations.",
  },
  {
    title: "Orders and Payments",
    content:
      "All orders are subject to availability and payment verification. Prices and product details may change without prior notice.",
  },
  {
    title: "User Responsibilities",
    content:
      "Customers are responsible for accurate account information and for keeping login credentials secure.",
  },
  {
    title: "Limitations",
    content:
      "Vidara is not liable for indirect losses arising from service interruptions, delays, or third-party delivery issues.",
  },
];

const TermsOfService = () => {
  return (
    <InfoPage
      badge="Legal"
      title="Terms of Service"
      description="These terms describe the rules and responsibilities for using the Vidara online store."
      sections={sections}
    />
  );
};

export default TermsOfService;
