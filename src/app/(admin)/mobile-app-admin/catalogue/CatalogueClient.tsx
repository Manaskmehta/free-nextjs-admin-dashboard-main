"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";

// Matches screenshot columns
const columns = [
  { key: "name", header: "Name" },
  { key: "noOfProducts", header: "No. of Products" },
  { key: "catalogueType", header: "Catalogue Type" },
  { key: "showInApp", header: "Show in App" },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
];

// Matches screenshot form fields
const fields = [
  // Basic Information
  { name: "name", label: "Catalogue Name", type: "text", placeholder: "Enter catalogue name", required: true },
  { 
    name: "addProductBy", 
    label: "Add Products By", 
    type: "select", 
    options: [{ value: "Barcode", label: "Barcode" }, { value: "Manual", label: "Manual" }],
    defaultValue: "Barcode"
  },
  { 
    name: "showInApp", 
    label: "Show Catalogue in App", 
    type: "radio", 
    options: [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]
  },
  {
      name: "setExpiry",
      label: "Set Expiry Date & Time",
      type: "checkbox", // Representing the toggle
  },
  
  // Target Audience
  {
      name: "targetAudience",
      label: "Target Audience",
      type: "radio",
      options: [
          { value: "All Users", label: "All Users (Visible to all registered and unregistered users)" },
          { value: "Registered Users", label: "Registered Users (Only visible to users who haven't registered yet)" }, // Text from screenshot
          { value: "Selective Users", label: "Selective Users (Choose specific users from the list)" }
      ]
  },

  // Product Management (Simplified as fields for now, ideally a complex component)
  {
      name: "productSearch",
      label: "Search Products",
      type: "text",
      placeholder: "Search by category or item code..."
  }
];

export default function CatalogueClient() {
  return (
    <MasterContainer
      title="My Catalogue"
      description="Manage your catalogues, track products, and monitor performance"
      columns={columns}
      fields={fields}
      // Empty state as shown in screenshot
      initialData={[]} 
      addButtonLabel="+ Add Catalogue"
    />
  );
}
