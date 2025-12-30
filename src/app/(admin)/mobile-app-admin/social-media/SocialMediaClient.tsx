"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";

const columns = [
  { key: "platform", header: "Platform" },
  { key: "url", header: "Link / URL" },
  { key: "status", header: "Status" },
];

const fields = [
  { 
      name: "platform", 
      label: "Platform", 
      type: "select", 
      options: [
          { value: "Instagram", label: "Instagram" },
          { value: "WhatsApp", label: "WhatsApp" },
          { value: "Facebook", label: "Facebook" },
          { value: "YouTube", label: "YouTube" },
          { value: "Twitter", label: "Twitter" },
      ],
      required: true 
  },
  { name: "url", label: "Profile URL / Number", type: "text", placeholder: "https://instagram.com/yourbrand", required: true },
  { 
      name: "status", 
      label: "Status", 
      type: "select", 
      options: [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }] 
  },
] as FieldSchema[];

export default function SocialMediaClient() {
  return (
    <MasterContainer
      title="Social Media Links"
      description="Manage links for Instagram, WhatsApp, Facebook, etc."
      columns={columns}
      fields={fields}
      initialData={[
          { id: 1, platform: "Instagram", url: "https://instagram.com/macanx", status: "Active" },
          { id: 2, platform: "WhatsApp", url: "+91 9876543210", status: "Active" },
      ]}
      addButtonLabel="+ Add Social Link"
    />
  );
}
