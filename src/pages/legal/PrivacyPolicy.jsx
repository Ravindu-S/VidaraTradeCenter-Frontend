import React from "react";
import InfoPage from "../common/InfoPage";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect account, order, and delivery details required to process purchases and provide support.",
  },
  {
    title: "How We Use Your Data",
    content:
      "Your data is used to fulfill orders, improve our services, send essential transaction updates, and prevent fraud.",
  },
  {
    title: "Data Protection",
    content:
      "We apply reasonable technical and operational safeguards to protect personal data from unauthorized access.",
  },
  {
    title: "Your Rights",
    content:
      "You may request account updates or ask about stored personal information by contacting our support team.",
  },
];

const PrivacyPolicy = () => {
  return (
    <InfoPage
      badge="Legal"
      title="Privacy Policy"
      description="This policy explains how Vidara handles personal information and protects customer privacy."
      sections={sections}
    />
  );
};

export default PrivacyPolicy;
