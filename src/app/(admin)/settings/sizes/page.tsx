"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";
import { sizeApi, CreateSizePayload, UpdateSizePayload } from "@/api/size";

const columns = [
  { key: "sizeLabel", header: "Size Label" },
];

const fields: FieldSchema[] = [
  { name: "sizeLabel", label: "Size Label", type: "text", required: true, placeholder: "e.g. 12" },
];

export default function SizeMasterPage() {
  const handleFetchData = async () => {
    return await sizeApi.getAll();
  };

  const handleCreate = async (data: any) => {
    const payload: CreateSizePayload = {
      sizeLabel: data.sizeLabel,
    };
    return await sizeApi.create(payload);
  };

  const handleUpdate = async (id: string, data: any) => {
    const payload: UpdateSizePayload = {
      sizeLabel: data.sizeLabel,
    };
    return await sizeApi.update(id, payload);
  };

  const handleDelete = async (id: string) => {
    return await sizeApi.delete(id);
  };

  return (
    <MasterContainer
      title="Size Master"
      description="Manage different sizes"
      columns={columns}
      fields={fields}
      onFetchData={handleFetchData}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
