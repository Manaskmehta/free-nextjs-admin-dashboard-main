"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";
import { hsnApi, CreateHSNPayload, UpdateHSNPayload } from "@/api/hsn";

const columns = [
  { key: "hsnCode", header: "HSN Code" },
  { key: "gstPercent", header: "GST %" },
];

const fields: FieldSchema[] = [
  { name: "hsnCode", label: "HSN Code", type: "text", required: true, placeholder: "e.g. 7113" },
  { name: "gstPercent", label: "GST Percentage", type: "number", required: true, placeholder: "e.g. 3.0" },
];

export default function HSNMasterPage() {
  const handleFetchData = async () => {
    return await hsnApi.getAll();
  };

  const handleCreate = async (data: any) => {
    const payload: CreateHSNPayload = {
      hsnCode: data.hsnCode,
      gstPercent: Number(data.gstPercent),
    };
    return await hsnApi.create(payload);
  };

  const handleUpdate = async (id: string, data: any) => {
    const payload: UpdateHSNPayload = {
      hsnCode: data.hsnCode,
      gstPercent: Number(data.gstPercent),
    };
    return await hsnApi.update(id, payload);
  };

  const handleDelete = async (id: string) => {
    return await hsnApi.delete(id);
  };

  return (
    <MasterContainer
      title="HSN Master"
      description="Manage HSN codes and GST percentages"
      columns={columns}
      fields={fields}
      onFetchData={handleFetchData}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
