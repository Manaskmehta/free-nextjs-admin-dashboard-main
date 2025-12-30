"use client";

import React, { useState, useEffect } from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";
import Image from "next/image";
import { BoxIcon } from "@/icons";
import { designApi, CreateDesignPayload, UpdateDesignPayload } from "@/api/design";
import { categoryApi } from "@/api/category";

const columns = [
  { 
    key: "image", 
    header: "Image",
    render: (value: any, row: any) => (
      <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {row.s3Key ? (
           <Image src={row.s3Key} alt="Design" width={48} height={48} className="h-full w-full object-cover" />
        ) : (
           <div className="flex items-center justify-center h-full text-gray-400">
             <BoxIcon className="w-5 h-5" />
           </div>
        )}
      </div>
    )
  },
  { key: "designNo", header: "Design No" },
  { 
    key: "category", 
    header: "Category",
    render: (value: any) => value?.name || value || "-"
  },
  { key: "nwt", header: "Net Wt." },
  { key: "gwt", header: "Gross Wt." },
];

export default function DesignClient() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch dependencies (categories)
  const fetchDependencies = async () => {
    try {
      const cats = await categoryApi.getAll();
      setCategories(cats);
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
      name: "s3Key", 
      label: "Design Image URL", 
      type: "text", // Changed to text for now as we don't have file upload API yet
      required: true,
      hint: "Enter image URL"
    },
    { 
      name: "designNo", 
      label: "Design No", 
      type: "text", 
      required: true, 
      placeholder: "e.g. DSN-2024-001" 
    },
    { 
      name: "categoryId", 
      label: "Category", 
      type: "select", 
      required: true,
      placeholder: "Select Category",
      options: categories.map(c => ({ label: c.name, value: c.id }))
    },
    { 
      name: "nwt", 
      label: "Net Weight (gms)", 
      type: "number", 
      placeholder: "0.000",
      required: true
    },
    { 
      name: "gwt", 
      label: "Gross Weight (gms)", 
      type: "number", 
      placeholder: "0.000",
      required: true
    },
    { 
      name: "owt", 
      label: "Other Weight (gms)", 
      type: "number", 
      placeholder: "0.000",
      hint: "Weight of stones, enamel, etc."
    },
  ];

  const handleFetchData = async () => {
    return await designApi.getAll();
  };

  const handleCreate = async (data: any) => {
    // Ensure numbers are numbers
    const payload: CreateDesignPayload = {
      designNo: data.designNo,
      categoryId: data.categoryId,
      s3Key: data.s3Key,
      gwt: Number(data.gwt),
      nwt: Number(data.nwt),
      owt: Number(data.owt || 0),
    };
    return await designApi.create(payload);
  };

  const handleUpdate = async (id: string, data: any) => {
    const payload: UpdateDesignPayload = {
      designNo: data.designNo,
      categoryId: data.categoryId,
      s3Key: data.s3Key,
      gwt: data.gwt ? Number(data.gwt) : undefined,
      nwt: data.nwt ? Number(data.nwt) : undefined,
      owt: data.owt ? Number(data.owt) : undefined,
    };
    return await designApi.update(id, payload);
  };

  const handleDelete = async (id: string) => {
    return await designApi.delete(id);
  };

  if (loading) {
    return <div>Loading dependencies...</div>;
  }

  return (
    <MasterContainer
      title="Design Master"
      description="Manage your jewelry designs and specifications"
      columns={columns}
      fields={fields}
      onFetchData={handleFetchData}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onFormOpen={fetchDependencies}
    />
  );
}
