"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";
import { purityApi, CreatePurityPayload, UpdatePurityPayload } from "@/api/purity";

const columns = [
  { key: "purityLabel", header: "Purity Label" },
  { key: "purityPercent", header: "Purity %" },
];

const fields: FieldSchema[] = [
  { name: "purityLabel", label: "Purity Label", type: "text", required: true, placeholder: "e.g. 22K" },
  { name: "purityPercent", label: "Purity Percentage", type: "number", required: true, placeholder: "e.g. 91.6" },
];

export default function PurityMasterPage() {
  const handleFetchData = async () => {
    return await purityApi.getAll();
  };

  const handleCreate = async (data: any) => {
    const payload: CreatePurityPayload = {
      purityLabel: data.purityLabel,
      purityPercent: Number(data.purityPercent),
    };
    return await purityApi.create(payload);
  };

  const handleUpdate = async (id: string, data: any) => {
    const payload: UpdatePurityPayload = {
      purityLabel: data.purityLabel,
      purityPercent: Number(data.purityPercent),
    };
    return await purityApi.update(id, payload);
  };

  const handleDelete = async (id: string) => {
    return await purityApi.delete(id);
  };

  return (
    <MasterContainer
      title="Purity Master"
      description="Manage different purity levels"
      columns={columns}
      fields={fields}
      onFetchData={handleFetchData}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
