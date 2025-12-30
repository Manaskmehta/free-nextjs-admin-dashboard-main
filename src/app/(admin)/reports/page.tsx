import React from "react";
import { Metadata } from "next";
import ReportsClient from "./ReportsClient";

export const metadata: Metadata = {
  title: "Reports | Macanx ERP",
  description: "View and export reports",
};

export default function ReportsPage() {
  return <ReportsClient />;
}
