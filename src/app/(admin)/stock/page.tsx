import React from "react";
import { Metadata } from "next";
import StockClient from "./StockClient";

export const metadata: Metadata = {
  title: "Stock List | Macanx ERP",
  description: "Stock management",
};

export default function StockPage() {
  return <StockClient />;
}
