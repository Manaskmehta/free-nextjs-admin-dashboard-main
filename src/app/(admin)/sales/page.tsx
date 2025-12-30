import React from "react";
import { Metadata } from "next";
import SalesClient from "./SalesClient";

export const metadata: Metadata = {
  title: "Sales Invoice | Macanx ERP",
  description: "Manage sales invoice records",
};

export default function SalesPage() {
  return <SalesClient />;
}
