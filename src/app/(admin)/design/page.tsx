import React from "react";
import { Metadata } from "next";
import DesignClient from "./DesignClient";

export const metadata: Metadata = {
  title: "Design Master | Macanx ERP",
  description: "Manage your jewelry designs and specifications",
};

export default function DesignPage() {
  return <DesignClient />;
}
