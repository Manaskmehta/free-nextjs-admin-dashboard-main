import React from "react";
import { Metadata } from "next";
import PushNotificationsClient from "./PushNotificationsClient";

export const metadata: Metadata = {
  title: "Push Notifications | Macanx ERP",
  description: "Manage Push Notifications",
};

export default function PushNotificationsPage() {
  return <PushNotificationsClient />;
}
