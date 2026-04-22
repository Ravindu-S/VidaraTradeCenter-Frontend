import React from "react";
import InfoPage from "../common/InfoPage";

const sections = [
  {
    title: "How can I track my order?",
    content:
      "Once your order is shipped, we send a tracking link to your email so you can follow each delivery update.",
  },
  {
    title: "Can I cancel an order after payment?",
    content:
      "If your order has not shipped yet, contact support immediately and we will do our best to assist with cancellation.",
  },
  {
    title: "Do you restock sold-out products?",
    content:
      "Yes, many items are restocked regularly. Availability depends on supplier schedules and seasonal demand.",
  },
  {
    title: "How do I update my shipping address?",
    content:
      "You can manage saved addresses from your profile. If an order is already placed, contact support quickly for address changes.",
  },
];

const Faq = () => {
  return (
    <InfoPage
      badge="Support"
      title="Frequently Asked Questions"
      description="Quick answers to the most common questions from our customers."
      sections={sections}
    />
  );
};

export default Faq;
