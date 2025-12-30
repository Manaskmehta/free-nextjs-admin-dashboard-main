"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";

const columns = [
  { key: "productName", header: "Product Name" },
  { key: "category", header: "Category" },
  { key: "allocationType", header: "Allocation Type" }, // e.g., Best Seller, Trending
  { key: "sortOrder", header: "Sort Order" },
  { key: "status", header: "Status" },
];

const fields = [
  { name: "productName", label: "Product", type: "text", required: true }, // Ideally a search/select
  { 
      name: "allocationType", 
      label: "Allocation Type", 
      type: "select", 
      options: [
          { value: "Best Seller", label: "Best Seller" },
          { value: "Trending", label: "Trending" },
          { value: "New Arrival", label: "New Arrival" },
          { value: "Exclusive", label: "Exclusive" },
      ],
      required: true
  },
  { name: "sortOrder", label: "Sort Order", type: "number" },
  { 
      name: "status", 
      label: "Status", 
      type: "select", 
      options: [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }] 
  },
] as FieldSchema[];

export default function PrimaryAllocationClient() {
  return (
    <MasterContainer
      title="Primary Allocation"
      description="Manage product allocation for home screen sections like Best Sellers, Trending, etc."
      columns={columns}
      fields={fields}
      initialData={[
          { id: 1, productName: "Gold Necklace Set", category: "Necklace", allocationType: "Best Seller", sortOrder: 1, status: "Active" },
          { id: 2, productName: "Diamond Ring", category: "Ring", allocationType: "Trending", sortOrder: 1, status: "Active" },
      ]}
      addButtonLabel="+ Allocate Product"
    />
  );
}
