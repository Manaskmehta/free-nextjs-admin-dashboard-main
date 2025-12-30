import React from "react";
import { Metadata } from "next";
import BrandingClient from "./BrandingClient";

export const metadata: Metadata = {
  title: "Branding | Macanx ERP",
  description: "Manage Branding",
};

export default function BrandingPage() {
  return <BrandingClient />;
}
