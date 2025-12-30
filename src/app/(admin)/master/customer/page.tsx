"use client";

import React from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";
import { customerApi, CreateCustomerPayload, UpdateCustomerPayload } from "@/api/customer";

const columns = [
  { key: "name", header: "Name" },
  { key: "phone", header: "Phone" },
  { key: "email", header: "Email" },
  { key: "customerType", header: "Type" },
  { key: "city", header: "City" },
];

const fields: FieldSchema[] = [
  { name: "name", label: "Customer Name", type: "text", required: true },
  { 
    name: "customerType", 
    label: "Customer Type", 
    type: "radio", 
    required: true,
    options: [
      { label: "B2C", value: "B2C" },
      { label: "B2B", value: "B2B" },
    ]
  },
  { name: "phone", label: "Phone Number", type: "text", required: true, placeholder: "9876543210" },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "address", label: "Address", type: "textarea", required: true },
  { name: "state", label: "State", type: "text", required: true },
  { name: "city", label: "City", type: "text", required: true },
  { name: "country", label: "Country", type: "text", required: true, placeholder: "India" },
  { name: "pincode", label: "Pincode", type: "text", required: true },
  { 
    name: "gstNo", 
    label: "GST Number", 
    type: "text", 
    conditional: (values) => values.customerType === "B2B"
  },
  { name: "panNo", label: "PAN Number", type: "text" },
  { 
    name: "gender", 
    label: "Gender", 
    type: "select", 
    options: [
      { label: "Male", value: "MALE" },
      { label: "Female", value: "FEMALE" },
      { label: "Other", value: "OTHER" },
    ]
  },
  { name: "birthDate", label: "Birth Date", type: "date" },
  { name: "anniversary", label: "Anniversary", type: "date" },
];

export default function CustomerMasterPage() {
  const handleFetchData = async () => {
    return await customerApi.getAll();
  };

  const handleCreate = async (data: any) => {
    const payload: CreateCustomerPayload = {
      name: data.name,
      customerType: data.customerType,
      email: data.email,
      phone: data.phone,
      address: data.address,
      state: data.state,
      city: data.city,
      country: data.country,
      pincode: data.pincode,
      gstNo: data.gstNo,
      panNo: data.panNo,
      gender: data.gender,
      birthDate: data.birthDate,
      anniversary: data.anniversary,
    };
    return await customerApi.create(payload);
  };

  const handleUpdate = async (id: string, data: any) => {
    const payload: UpdateCustomerPayload = {
      name: data.name,
      customerType: data.customerType,
      email: data.email,
      phone: data.phone,
      address: data.address,
      state: data.state,
      city: data.city,
      country: data.country,
      pincode: data.pincode,
      gstNo: data.gstNo,
      panNo: data.panNo,
      gender: data.gender,
      birthDate: data.birthDate,
      anniversary: data.anniversary,
    };
    return await customerApi.update(id, payload);
  };

  const handleDelete = async (id: string) => {
    return await customerApi.delete(id);
  };

  return (
    <MasterContainer
      title="Customer Master"
      description="Manage customer records and details"
      columns={columns}
      fields={fields}
      onFetchData={handleFetchData}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
