"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";

const columns = [
  { key: "type", header: "Type" },
  { key: "title", header: "Title" },
  { key: "status", header: "Status" },
  { key: "lastUpdated", header: "Last Updated" },
];

const fields: FieldSchema[] = [
  {
    name: "type",
    label: "Branding Type",
    type: "select",
    options: [
      { value: "Splash Screen", label: "Splash Screen" },
      { value: "Slider Image", label: "Slider Image" },
      { value: "Brand Banner", label: "Brand Banner" },
    ],
    required: true,
  },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "image", label: "Upload Image", type: "file" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
    ],
  },
];

export default function BrandingClient() {
  return (
    <MasterContainer
      title="Branding"
      description="Manage Splash Screens, Slider Images, and Brand Banners"
      columns={columns}
      fields={fields}
      // Provide some sample data
      initialData={[
        {
          id: 1,
          type: "Splash Screen",
          title: "Diwali Special",
          status: "Active",
          lastUpdated: "2024-10-25",
        },
        {
          id: 2,
          type: "Slider Image",
          title: "New Arrivals 2024",
          status: "Active",
          lastUpdated: "2024-11-01",
        },
        {
          id: 3,
          type: "Brand Banner",
          title: "Wedding Collection",
          status: "Inactive",
          lastUpdated: "2024-09-15",
        },
      ]}
    />
  );
}
