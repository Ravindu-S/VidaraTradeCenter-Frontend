import React from "react";
import InfoPage from "../common/InfoPage";

const sections = [
  {
    title: "Email Support",
    content:
      "Send us your question at support@vidara.lk and we usually respond within one business day.",
  },
  {
    title: "Phone Support",
    content:
      "Reach our team at +94 11 234 5678 from Monday to Friday, 9:00 AM to 6:00 PM.",
  },
  {
    title: "Order Help",
    content:
      "For faster support, include your order number and the email used at checkout when contacting us.",
  },
];

const Contact = () => {
  return (
    <InfoPage
      badge="Support"
      title="Contact Us"
      description="Our team is ready to help with orders, returns, products, and account questions."
      sections={sections}
      showHelpButton={false}
    />
  );
};

export default Contact;
