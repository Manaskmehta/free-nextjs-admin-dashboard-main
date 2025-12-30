import React from "react";
import { Metadata } from "next";
import CatalogueClient from "./CatalogueClient";

export const metadata: Metadata = {
  title: "My Catalogue | Macanx ERP",
  description: "Manage My Catalogue",
};

export default function CataloguePage() {
  return <CatalogueClient />;
}
