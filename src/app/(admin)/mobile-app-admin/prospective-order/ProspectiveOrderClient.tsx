"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";

const columns = [
  { key: "userName", header: "User Name" },
  { key: "grossWeight", header: "Gross Weight" },
  { key: "netWeight", header: "Net Weight" },
  { key: "pieces", header: "Pieces" },
];

const fields = [
  { name: "userName", label: "User Name", type: "text", disabled: true },
  { name: "grossWeight", label: "Gross Weight", type: "number", disabled: true },
  { name: "netWeight", label: "Net Weight", type: "number", disabled: true },
  { name: "pieces", label: "Pieces", type: "number", disabled: true },
  { name: "status", label: "Status", type: "select", options: [{value: "Pending", label: "Pending"}, {value: "Processed", label: "Processed"}] },
];

export default function ProspectiveOrderClient() {
  return (
    <MasterContainer
      title="Prospective Orders"
      description="Manage cart and wish list orders"
      columns={columns}
      fields={fields}
      initialData={[]}
      addButtonLabel="" 
    />
  );
}
