import React from "react";
import { Metadata } from "next";
import FeaturedProductsClient from "./FeaturedProductsClient";

export const metadata: Metadata = {
  title: "Featured Products | Macanx ERP",
  description: "Manage Featured Products",
};

export default function FeaturedProductsPage() {
  return <FeaturedProductsClient />;
}
