import React from "react";
import InfoPage from "../common/InfoPage";

const sections = [
  {
    title: "Return Window",
    content:
      "You can request a return within 7 days of delivery for items that are unused and in their original condition and packaging.",
  },
  {
    title: "Items Not Eligible",
    content:
      "Used products, damaged items caused after delivery, and items without original packaging may not qualify for return.",
  },
  {
    title: "Refund Process",
    content:
      "After the returned item is inspected, eligible refunds are processed to the original payment method within 5-10 business days.",
  },
];

const Returns = () => {
  return (
    <InfoPage
      badge="Support"
      title="Returns & Refunds"
      description="Our return process is designed to be simple, fair, and transparent."
      sections={sections}
    />
  );
};

export default Returns;
