"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";
import { materialTypeApi, CreateMaterialTypePayload, UpdateMaterialTypePayload } from "@/api/materialType";

const columns = [
  { key: "typeName", header: "Material Type Name" },
];

const fields: FieldSchema[] = [
  { name: "typeName", label: "Material Type Name", type: "text", required: true, placeholder: "e.g. Gold 22k" },
];

export default function MaterialTypeMasterPage() {
  const handleFetchData = async () => {
    return await materialTypeApi.getAll();
  };

  const handleCreate = async (data: any) => {
    const payload: CreateMaterialTypePayload = {
      typeName: data.typeName,
    };
    return await materialTypeApi.create(payload);
  };

  const handleUpdate = async (id: string, data: any) => {
    const payload: UpdateMaterialTypePayload = {
      typeName: data.typeName,
    };
    return await materialTypeApi.update(id, payload);
  };

  const handleDelete = async (id: string) => {
    return await materialTypeApi.delete(id);
  };

  return (
    <MasterContainer
      title="Material Type Master"
      description="Manage different types of materials"
      columns={columns}
      fields={fields}
      onFetchData={handleFetchData}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
