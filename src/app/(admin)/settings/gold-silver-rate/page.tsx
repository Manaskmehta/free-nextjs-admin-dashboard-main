import React from "react";
import PageContainer from "@/components/common/PageContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold / Silver Rate | Macanx ERP",
  description: "Update daily rates",
};

export default function GoldSilverRatePage() {
  return (
    <PageContainer
      title="Gold / Silver Rate"
      description="Update daily rates"
    />
  );
}
