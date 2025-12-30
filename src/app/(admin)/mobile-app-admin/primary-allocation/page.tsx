import React from "react";
import { Metadata } from "next";
import PrimaryAllocationClient from "./PrimaryAllocationClient";

export const metadata: Metadata = {
  title: "Primary Allocation | Macanx ERP",
  description: "Manage Primary Allocation",
};

export default function PrimaryAllocationPage() {
  return <PrimaryAllocationClient />;
}
