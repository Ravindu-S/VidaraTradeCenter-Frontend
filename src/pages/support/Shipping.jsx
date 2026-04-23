import React from "react";
import InfoPage from "../common/InfoPage";

const sections = [
  {
    title: "Processing Time",
    content:
      "Orders are processed within 1-2 business days after payment confirmation. You will receive an email update as soon as your order is packed.",
  },
  {
    title: "Delivery Window",
    content:
      "Most local deliveries arrive within 2-5 business days. Delivery timing may vary during holidays, public events, or high-volume periods.",
  },
  {
    title: "Tracking Updates",
    content:
      "When your order is shipped, we send tracking details to your email so you can follow the package until delivery.",
  },
];

const Shipping = () => {
  return (
    <InfoPage
      badge="Support"
      title="Shipping Information"
      description="Everything you need to know about how we process and deliver your order."
      sections={sections}
    />
  );
};

export default Shipping;
