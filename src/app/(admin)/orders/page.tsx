import React from "react";
import { Metadata } from "next";
import OrdersClient from "./OrdersClient";

export const metadata: Metadata = {
  title: "Orders | Macanx ERP",
  description: "Manage customer orders",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
