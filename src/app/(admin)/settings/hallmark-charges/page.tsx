"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";
import { makingChargeApi, CreateMakingChargePayload, UpdateMakingChargePayload, ChargeMode } from "@/api/makingCharge";

const columns = [
  { key: "chargeMode", header: "Charge Mode" },
  { key: "value", header: "Value" },
];

const fields: FieldSchema[] = [
  { 
    name: "chargeMode", 
    label: "Charge Mode", 
    type: "select", 
    required: true,
    options: [
      { label: "Per Gram", value: "PER_GRAM" },
      { label: "Percent", value: "PERCENT" },
      { label: "Per Piece", value: "PER_PIECE" },
    ]
  },
  { name: "value", label: "Value", type: "number", required: true, placeholder: "e.g. 100.00" },
];

export default function HallmarkChargesPage() {
  const handleFetchData = async () => {
    return await makingChargeApi.getAll();
  };

  const handleCreate = async (data: any) => {
    const payload: CreateMakingChargePayload = {
      chargeMode: data.chargeMode as ChargeMode,
      value: Number(data.value),
    };
    return await makingChargeApi.create(payload);
  };

  const handleUpdate = async (id: string, data: any) => {
    const payload: UpdateMakingChargePayload = {
      chargeMode: data.chargeMode as ChargeMode,
      value: Number(data.value),
    };
    return await makingChargeApi.update(id, payload);
  };

  const handleDelete = async (id: string) => {
    return await makingChargeApi.delete(id);
  };

  return (
    <MasterContainer
      title="Making Charges" // Assuming this page is for Making Charges based on API request
      description="Configure making charges and calculation modes"
      columns={columns}
      fields={fields}
      onFetchData={handleFetchData}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
