"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";
import { salesmanApi, CreateSalesmanPayload, UpdateSalesmanPayload } from "@/api/salesman";

const columns = [
  { key: "name", header: "Name" },
  { key: "phone", header: "Phone" },
  { key: "email", header: "Email" },
  { key: "city", header: "City" },
];

const fields: FieldSchema[] = [
  { name: "name", label: "Salesman Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "phone", label: "Phone Number", type: "text", required: true, placeholder: "9876543210" },
  { name: "address", label: "Address", type: "textarea", required: true },
  { name: "aadhaarNo", label: "Aadhaar No", type: "text", placeholder: "1234 5678 9012" },
  { name: "panNo", label: "PAN No", type: "text", placeholder: "ABCDE1234F" },
  { name: "accountNo", label: "Bank Account No", type: "text" },
  { name: "ifsc", label: "IFSC Code", type: "text" },
  { name: "bankName", label: "Bank Name", type: "text" },
  { name: "bankAddress", label: "Bank Address", type: "textarea" },
];

export default function SalesmanMasterPage() {
  const handleFetchData = async () => {
    return await salesmanApi.getAll();
  };

  const handleCreate = async (data: any) => {
    const payload: CreateSalesmanPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      aadhaarNo: data.aadhaarNo,
      panNo: data.panNo,
      accountNo: data.accountNo,
      ifsc: data.ifsc,
      bankName: data.bankName,
      bankAddress: data.bankAddress,
    };
    return await salesmanApi.create(payload);
  };

  const handleUpdate = async (id: string, data: any) => {
    const payload: UpdateSalesmanPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      aadhaarNo: data.aadhaarNo,
      panNo: data.panNo,
      accountNo: data.accountNo,
      ifsc: data.ifsc,
      bankName: data.bankName,
      bankAddress: data.bankAddress,
    };
    return await salesmanApi.update(id, payload);
  };

  const handleDelete = async (id: string) => {
    return await salesmanApi.delete(id);
  };

  return (
    <MasterContainer
      title="Salesman Master"
      description="Manage salesman profiles"
      columns={columns}
      fields={fields}
      onFetchData={handleFetchData}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
