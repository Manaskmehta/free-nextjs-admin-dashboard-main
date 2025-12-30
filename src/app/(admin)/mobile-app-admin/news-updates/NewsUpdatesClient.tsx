"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";

const columns = [
  { key: "title", header: "Title" },
  { key: "date", header: "Date" },
  { key: "media", header: "Media" },
  { key: "shortDescription", header: "Short Description" },
  { key: "description", header: "Description" },
];

const fields = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "media", label: "Media (Image/Video)", type: "file" },
  { name: "shortDescription", label: "Short Description", type: "textarea" },
  { name: "description", label: "Description", type: "textarea" },
];

export default function NewsUpdatesClient() {
  return (
    <MasterContainer
      title="News & Updates"
      description="Manage news articles and updates for your mobile app"
      columns={columns}
      fields={fields}
      initialData={[]}
      addButtonLabel="+ Add News & Updates"
    />
  );
}
