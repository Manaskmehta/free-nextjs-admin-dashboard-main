"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";

const columns = [
  { key: "title", header: "Title" },
  { key: "message", header: "Message" },
  { key: "scheduledTime", header: "Scheduled Time" },
  { key: "status", header: "Status" },
];

const fields = [
  // What and When?
  { name: "title", label: "Notification Title", type: "text", placeholder: "Notification Title", required: true },
  { name: "message", label: "Message", type: "textarea", placeholder: "Enter Notification Message", required: true },
  { name: "image", label: "Image", type: "file", placeholder: "Browse Image" },
  
  // Send When?
  { 
      name: "sendNow", 
      label: "Send Now", 
      type: "checkbox" 
  },
  {
      name: "scheduleTime",
      label: "Schedule Time",
      type: "datetime-local",
      placeholder: "dd / mm / yyyy , -- : -- --"
  }
];

export default function PushNotificationsClient() {
  return (
    <MasterContainer
      title="Push Notification"
      description="Create and schedule notifications for selected users"
      columns={columns}
      fields={fields}
      initialData={[]}
      addButtonLabel="+ Create Notification"
    />
  );
}
