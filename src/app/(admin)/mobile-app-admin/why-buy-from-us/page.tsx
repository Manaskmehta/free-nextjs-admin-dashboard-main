import React from "react";
import { Metadata } from "next";
import WhyBuyFromUsClient from "./WhyBuyFromUsClient";

export const metadata: Metadata = {
  title: "Why Buy From US? | Macanx ERP",
  description: "Manage Why Buy From US content",
};

export default function WhyBuyFromUsPage() {
  return <WhyBuyFromUsClient />;
}
