"use client";

import React, { useState, useEffect } from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";
import { categoryApi, CreateCategoryPayload, UpdateCategoryPayload } from "@/api/category";
import { hsnApi } from "@/api/hsn";

const columns = [
  { key: "name", header: "Name" },
  { key: "code", header: "Code" },
  { key: "metalType", header: "Metal Type" },
  { 
    key: "isSubcategory", 
    header: "Type",
    render: (value: boolean) => value ? "Subcategory" : "Main Category"
  },
  { 
    key: "parent", 
    header: "Parent Category",
    render: (value: any) => value?.name || "-"
  },
];

export default function CategoryMasterClient() {
  const [categories, setCategories] = useState<any[]>([]);
  const [hsnCodes, setHsnCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch dependencies (categories and HSN codes)
  const fetchDependencies = async () => {
    try {
      const [cats, hsns] = await Promise.all([
        categoryApi.getAll(), // Fetch all to filter client-side or use getAllMain if available
        hsnApi.getAll()
      ]);
      setCategories(cats);
      setHsnCodes(hsns);
    } catch (error) {
      console.error("Failed to fetch dependencies:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDependencies().finally(() => setLoading(false));
  }, []);

  const fields: FieldSchema[] = [
    { 
      name: "name", 
      label: "Category Name", 
      type: "text", 
      required: true, 
      placeholder: "Enter category name" 
    },
    { 
      name: "code", 
      label: "Category Code", 
      type: "text", 
      required: true,
      placeholder: "e.g. CAT001" 
    },
    { 
      name: "metalType", 
      label: "Metal Type", 
      type: "select", 
      required: true,
      options: [
        { label: "Gold", value: "GOLD" },
        { label: "Silver", value: "SILVER" },
        { label: "Platinum", value: "PLATINUM" },
        { label: "Other", value: "OTHER" },
      ] 
    },
    { 
      name: "isSubcategory", 
      label: "Is Subcategory?", 
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      required: true,
    },
    {
      name: "parentId",
      label: "Parent Category",
      type: "select",
      placeholder: "Select Parent Category",
      options: categories
        .filter(c => !c.isSubcategory) // Only allow main categories as parents
        .map(c => ({ label: c.name, value: c.id })),
      conditional: (values) => values.isSubcategory === "true" || values.isSubcategory === true,
      required: true
    },
    { 
      name: "hsnId", 
      label: "HSN Code", 
      type: "select",
      placeholder: "Select HSN Code",
      options: hsnCodes.map(h => ({ 
        label: `${h.hsnCode} (${h.gstPercent}%)`, 
        value: h.id 
      })),
      required: true
    },
    { 
      name: "description", 
      label: "Description", 
      type: "textarea", 
      placeholder: "Category description..." 
    },
    { 
      name: "image", 
      label: "Category Image URL", 
      type: "text", 
      placeholder: "Image URL or S3 Key" 
    },
  ];

  const handleFetchData = async () => {
    // We already fetched categories in useEffect, but MasterContainer might want to refresh
    const cats = await categoryApi.getAll();
    setCategories(cats); // Update local state as well
    return cats;
  };

  const handleCreate = async (data: any) => {
    // Handle boolean conversion for radio button value (which might be string "true"/"false")
    const isSub = data.isSubcategory === true || data.isSubcategory === "true";
    
    const payload: CreateCategoryPayload = {
      name: data.name,
      code: data.code,
      metalType: data.metalType,
      isSubcategory: isSub,
      parentId: isSub ? data.parentId : undefined,
      description: data.description,
      image: data.image,
      hsnId: data.hsnId,
    };
    return await categoryApi.create(payload);
  };

  const handleUpdate = async (id: string, data: any) => {
    const isSub = data.isSubcategory === true || data.isSubcategory === "true";

    const payload: UpdateCategoryPayload = {
      name: data.name,
      code: data.code,
      metalType: data.metalType,
      isSubcategory: isSub,
      parentId: isSub ? data.parentId : undefined,
      description: data.description,
      image: data.image,
      hsnId: data.hsnId,
    };
    return await categoryApi.update(id, payload);
  };

  const handleDelete = async (id: string) => {
    return await categoryApi.delete(id);
  };

  if (loading) {
    return <div>Loading dependencies...</div>;
  }

  return (
    <MasterContainer
      title="Category Master"
      description="Manage product categories and subcategories"
      columns={columns}
      fields={fields}
      onFetchData={handleFetchData}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onFormOpen={fetchDependencies} // Pass fetchDependencies to reload data when form opens
    />
  );
}
