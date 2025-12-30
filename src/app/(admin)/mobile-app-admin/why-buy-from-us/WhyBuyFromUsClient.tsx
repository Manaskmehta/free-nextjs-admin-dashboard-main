"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";

const columns = [
  { key: "title", header: "Title" },
  { key: "icon", header: "Icon/Image" },
  { key: "description", header: "Description" },
  { key: "sortOrder", header: "Sort Order" },
];

const fields = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "image", label: "Icon/Image", type: "file" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "sortOrder", label: "Sort Order", type: "number" },
];

export default function WhyBuyFromUsClient() {
  return (
    <MasterContainer
      title="Why Buy From Us?"
      description="Manage content for 'Why Buy From Us' section"
      columns={columns}
      fields={fields}
      initialData={[
          { id: 1, title: "Certified Jewellery", icon: "cert.png", description: "100% Hallmark Certified", sortOrder: 1 },
          { id: 2, title: "Lifetime Exchange", icon: "exchange.png", description: "Easy exchange policy", sortOrder: 2 },
          { id: 3, title: "Free Shipping", icon: "shipping.png", description: "Insured free shipping across India", sortOrder: 3 },
      ]}
      addButtonLabel="+ Add Content"
    />
  );
}
