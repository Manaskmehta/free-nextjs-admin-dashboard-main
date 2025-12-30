import React from "react";
import PageContainer from "@/components/common/PageContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile App Admin | Macanx ERP",
  description: "Administration for mobile application",
};

export default function MobileAppAdminPage() {
  return (
    <PageContainer
      title="Mobile App Admin"
      description="Administration for mobile application"
    />
  );
}
