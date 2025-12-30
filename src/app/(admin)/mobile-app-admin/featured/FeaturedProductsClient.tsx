"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";

const columns = [
  { key: "designNo", header: "Design No" },
  { key: "category", header: "Category" },
  { key: "grossWeight", header: "Gross Wt" },
  { key: "netWeight", header: "Net Wt" },
  { key: "status", header: "Status" },
];

const fields = [
  { name: "designNo", label: "Design No", type: "text", required: true },
  { 
      name: "category", 
      label: "Category", 
      type: "select", 
      options: [
          { value: "Rings", label: "Rings" },
          { value: "Bangles", label: "Bangles" },
          { value: "Chains", label: "Chains" },
      ]
  },
  { name: "grossWeight", label: "Gross Weight", type: "number" },
  { name: "netWeight", label: "Net Weight", type: "number" },
  { 
      name: "status", 
      label: "Status", 
      type: "select", 
      options: [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }] 
  },
];

export default function FeaturedProductsClient() {
  return (
    <MasterContainer
      title="Featured Products"
      description="List of designs added to Featured Products"
      columns={columns}
      fields={fields}
      initialData={[
          { id: 1, designNo: "D-1001", category: "Rings", grossWeight: 5.5, netWeight: 5.0, status: "Active" },
          { id: 2, designNo: "D-1002", category: "Bangles", grossWeight: 15.2, netWeight: 14.8, status: "Active" },
      ]}
      addButtonLabel="+ Add Featured Product"
    />
  );
}
