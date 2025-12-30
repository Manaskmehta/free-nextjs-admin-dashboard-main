import React from "react";
import { Metadata } from "next";
import CMSClient from "./CMSClient";

export const metadata: Metadata = {
  title: "CMS | Macanx ERP",
  description: "Manage CMS",
};

export default function CMSPage() {
  return <CMSClient />;
}
