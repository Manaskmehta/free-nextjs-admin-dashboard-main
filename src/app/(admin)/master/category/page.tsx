import React from "react";
import { Metadata } from "next";
import CategoryMasterClient from "./CategoryMasterClient";

export const metadata: Metadata = {
  title: "Category Master | Macanx ERP",
  description: "Manage product categories",
};

export default function CategoryMasterPage() {
  return <CategoryMasterClient />;
}
