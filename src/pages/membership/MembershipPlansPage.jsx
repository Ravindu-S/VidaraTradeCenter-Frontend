import React from "react";
import { Navigate } from "react-router-dom";

/** /membership redirects here — plans live on My memberships. */
const MembershipPlansPage = () => {
  return <Navigate to="/subscriptions" replace />;
};

export default MembershipPlansPage;
