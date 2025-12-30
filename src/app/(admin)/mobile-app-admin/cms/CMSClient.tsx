"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";

const columns = [
  { key: "pageName", header: "Page Name" },
  { key: "slug", header: "Slug" },
  { key: "lastUpdated", header: "Last Updated" },
  { key: "status", header: "Status" },
];

const fields = [
  { name: "pageName", label: "Page Name", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "content", label: "Content", type: "textarea" },
  { 
      name: "status", 
      label: "Status", 
      type: "select", 
      options: [{ value: "Published", label: "Published" }, { value: "Draft", label: "Draft" }] 
  },
];

export default function CMSClient() {
  return (
    <MasterContainer
      title="CMS Pages"
      description="Manage content pages like About Us, Privacy Policy, etc."
      columns={columns}
      fields={fields}
      initialData={[
          { id: 1, pageName: "About Us", slug: "about-us", lastUpdated: "2024-12-01", status: "Published" },
          { id: 2, pageName: "Privacy Policy", slug: "privacy-policy", lastUpdated: "2024-11-15", status: "Published" },
          { id: 3, pageName: "Terms & Conditions", slug: "terms", lastUpdated: "2024-11-15", status: "Published" },
      ]}
      addButtonLabel="+ Add CMS Page"
    />
  );
}
