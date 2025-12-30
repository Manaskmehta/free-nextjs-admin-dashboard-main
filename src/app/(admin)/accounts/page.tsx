import React from "react";
import { Metadata } from "next";
import AccountsClient from "./AccountsClient";

export const metadata: Metadata = {
  title: "Accounts | Macanx ERP",
  description: "Manage user accounts and permissions",
};

export default function AccountsPage() {
  return <AccountsClient />;
}
