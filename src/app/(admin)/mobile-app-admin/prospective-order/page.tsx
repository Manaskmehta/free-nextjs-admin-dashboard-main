import React from "react";
import { Metadata } from "next";
import ProspectiveOrderClient from "./ProspectiveOrderClient";

export const metadata: Metadata = {
  title: "Prospective Order | Macanx ERP",
  description: "Manage Prospective Orders",
};

export default function ProspectiveOrderPage() {
  return <ProspectiveOrderClient />;
}
