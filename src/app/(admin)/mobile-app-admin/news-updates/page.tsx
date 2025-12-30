import React from "react";
import { Metadata } from "next";
import NewsUpdatesClient from "./NewsUpdatesClient";

export const metadata: Metadata = {
  title: "News & Updates | Macanx ERP",
  description: "Manage News & Updates",
};

export default function NewsUpdatesPage() {
  return <NewsUpdatesClient />;
}
