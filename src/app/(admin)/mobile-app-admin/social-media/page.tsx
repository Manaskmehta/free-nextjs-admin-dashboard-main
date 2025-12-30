import React from "react";
import { Metadata } from "next";
import SocialMediaClient from "./SocialMediaClient";

export const metadata: Metadata = {
  title: "Social Media | Macanx ERP",
  description: "Manage Social Media links",
};

export default function SocialMediaPage() {
  return <SocialMediaClient />;
}
