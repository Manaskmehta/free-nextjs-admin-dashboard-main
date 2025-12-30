"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import MasterContainer, { MasterContainerRef } from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";
import { stockApi, StockItem, CreateStockItemPayload, UpdateStockItemPayload } from "@/api/stock";
import { materialTypeApi, MaterialType } from "@/api/materialType";
import { categoryApi, Category } from "@/api/category";
import { sizeApi, Size } from "@/api/size";
import { purityApi, Purity } from "@/api/purity";
import { AddStockModal } from "./AddStockModal";

 

// --- Column Definitions ---
const columns = [
  { key: "stockType", header: "Stock Type" }, // This might need mapping from materialType? Or is it a separate field? The API has materialTypeId.
  { key: "barcode", header: "Stock Code" }, // Using barcode as Stock Code based on typical usage, or id? Mock had stockCode.
  { key: "categoryName", header: "Category" },
   { key: "pieces", header: "Pieces" },
  { key: "sizeLabel", header: "Size" },
  { key: "purityLabel", header: "Purity" },
  { key: "grossWeight", header: "Gross Weight" },
  { key: "stoneWeight", header: "Stone/Other Weight" },
  { key: "netWeight", header: "Net Weight" },
  { key: "wastagePercent", header: "Wastage %" },
  { key: "huid", header: "HUID" },
  { key: "fineWeight", header: "Fine" },
  { key: "stoneCost", header: "Stone Cost" },
  // { key: "hallmarkCharges", header: "Hallmark Charges" }, // Not in API payload
];

export default function StockClient() {
  const [activeTab, setActiveTab] = useState("All List");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null); // State for item being edited
  const masterContainerRef = useRef<MasterContainerRef>(null);

  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [purities, setPurities] = useState<Purity[]>([]);

  const fetchDependencies = async () => {
    try {
      const [matData, catData, sizeData, purityData] = await Promise.all([
        materialTypeApi.getAll(),
        categoryApi.getAll(),
        sizeApi.getAll(),
        purityApi.getAll()
      ]);
      setMaterialTypes(matData);
      setCategories(catData);
      setSizes(sizeData);
      setPurities(purityData);
    } catch (error) {
      console.error("Failed to fetch dependencies:", error);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  const fields: FieldSchema[] = useMemo(() => [
    { 
      name: "materialTypeId", 
      label: "Material Type", 
      type: "select", 
      required: true,
      options: materialTypes.map(m => ({ label: m.typeName, value: m.id }))
    },
    { 
      name: "categoryId", 
      label: "Category", 
      type: "select", 
      required: true,
      options: categories.map(c => ({ label: c.name, value: c.id }))
    },
        { name: "barcode", label: "Barcode", type: "text", hint: "Optional: If provided, creates a new BarcodeDetail" },

    { 
      name: "sizeId", 
      label: "Size", 
      type: "select", 
      options: sizes.map(s => ({ label: s.sizeLabel, value: s.id }))
    },
    { 
      name: "purityId", 
      label: "Purity", 
      type: "select", 
      required: true,
      options: purities.map(p => ({ label: `${p.purityLabel} (${p.purityPercent}%)`, value: p.id }))
    },
    { name: "pieces", label: "Pieces", type: "number", required: true },
    { name: "grossWeight", label: "Gross Weight", type: "number", required: true },
    { name: "stoneWeight", label: "Stone Weight", type: "number" },
    { name: "netWeight", label: "Net Weight", type: "number", required: true },
    { name: "wastagePercent", label: "Wastage %", type: "number" },
    { name: "fineWeight", label: "Fine Weight", type: "number" },
    { name: "huid", label: "HUID", type: "text" },
    { name: "stoneCost", label: "Stone Cost", type: "number" },
    { name: "approxSalesPrice", label: "Approx Sales Price", type: "number" },
    { 
      name: "status", 
      label: "Status", 
      type: "select", 
      required: true,
      options: [
        { label: "Available", value: "AVAILABLE" },
        { label: "Reserved", value: "RESERVED" },
        { label: "Sold", value: "SOLD" }
      ]
    },
    { name: "salesVoucherNo", label: "Sales Voucher No", type: "text" },
    { name: "orderNo", label: "Order No", type: "text" },
  ], [materialTypes, categories, sizes, purities]);

  const handleFetchData = async () => {
    const data = await stockApi.getAll();
    // Map data to match columns if necessary
    return data.map(item => ({
      ...item,
      categoryName: item.category?.name || "-",
      sizeLabel: item.size?.sizeLabel || "-",
      purityLabel: item.purity?.purityLabel || "-",
      stockType: item.materialType?.typeName || "-", // Assuming stockType maps to materialType
      barcode: item.barcodeDetails?.barcode || item.barcode || "-",
    }));
  };

  const handleCreate = async (data: any) => {
    // Ensure numeric fields are numbers
    const payload: CreateStockItemPayload = {
      ...data,
      pieces: Number(data.pieces),
      grossWeight: Number(data.grossWeight),
      stoneWeight: Number(data.stoneWeight || 0),
      netWeight: Number(data.netWeight),
      wastagePercent: Number(data.wastagePercent || 0),
      fineWeight: Number(data.fineWeight || 0),
      stoneCost: Number(data.stoneCost || 0),
      approxSalesPrice: Number(data.approxSalesPrice || 0),
    };
    return stockApi.create(payload);
  };

  const handleUpdate = async (id: string, data: any) => {
     const payload: UpdateStockItemPayload = {
      ...data,
      pieces: Number(data.pieces),
      grossWeight: Number(data.grossWeight),
      stoneWeight: Number(data.stoneWeight || 0),
      netWeight: Number(data.netWeight),
      wastagePercent: Number(data.wastagePercent || 0),
      fineWeight: Number(data.fineWeight || 0),
      stoneCost: Number(data.stoneCost || 0),
      approxSalesPrice: Number(data.approxSalesPrice || 0),
    };
    return stockApi.update(id, payload);
  };

  const handleDelete = async (id: string) => {
    return stockApi.delete(id);
  };

  return (
    <div className="w-full max-w-full">
      <div className="sticky left-0 right-0 z-10 bg-white dark:bg-gray-900 pt-4 pb-2">
        {/* Top Header Area: Search and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex-1" /> {/* Spacer */}
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Search..." 
              className="h-10 rounded-lg border border-gray-300 px-4 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => {
                fetchDependencies();
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
            >
              <span>+</span>
              <span>Add Stock</span>
            </button>
          </div>
        </div>

        </div>

      {/* Main Content using MasterContainer for Table logic */}
      <div className="w-full overflow-hidden">
        <MasterContainer
          ref={masterContainerRef}
          title=""
          description=""
          columns={columns}
          fields={fields}
          // initialData={mockData} // Removed mockData
          onFetchData={handleFetchData}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          addButtonLabel="Add Stock"
          hideToolbar={true} 
          externalSearchQuery={searchQuery} 
          onFormOpen={() => {
            // This is triggered by MasterContainer when adding/editing
            // But we are overriding Add, so this might only be for Edit if we use MasterContainer's edit
            // However, we want to replace Edit too.
            // MasterContainer doesn't easily expose "onEdit" click interception if we pass onUpdate.
            // We need to customize MasterContainer or pass a custom action?
            // Wait, MasterContainer calls onEdit which opens its internal form.
            // To replace the internal form, we can use the ref to get data but we can't easily stop the internal form from opening
            // UNLESS we don't pass onUpdate/onCreate to MasterContainer and handle actions externally?
            // Or we can pass a dummy onUpdate and control the UI via a separate mechanism?
            // Actually, better way: 
            // We can pass `onEdit` prop to MasterTable if exposed, but MasterContainer wraps it.
            // MasterContainer has `onView` which calls `handleEdit`.
            
            // Let's look at MasterContainer again. It has `onEdit` passed to MasterTable.
            // But MasterContainer defines `handleEdit` internally.
            
            // We might need to modify MasterContainer to allow external handling of Edit,
            // OR we can just pass a dummy onUpdate that does nothing, but we need to open OUR modal.
            
            // Actually, MasterContainer doesn't expose a way to override the Edit click behavior directly to open a different modal
            // WITHOUT modifying MasterContainer.
            // But we can use the `onFormOpen` prop? No, that's called AFTER state change.
            
            // Let's rely on the fact that we can modify MasterContainer if needed, 
            // OR we can just copy the handleEdit logic into a new prop `onCustomEdit`?
            
            // For now, let's assume we can't easily change MasterContainer's internal `handleEdit` without changing the file.
            // Let's change MasterContainer to accept `onCustomEdit` which if present, skips internal form opening.
          }}
          onCustomEdit={(row) => {
            fetchDependencies();
            setEditItem(row);
          }}
        />
      </div>

      <AddStockModal
        isOpen={isAddModalOpen || !!editItem}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditItem(null);
        }}
        onSave={async (data) => {
          if (editItem) {
            await handleUpdate(editItem.id, data);
          } else {
            await handleCreate(data);
          }
          await masterContainerRef.current?.loadData();
        }}
        dependencies={{
          materialTypes,
          categories,
          sizes,
          purities
        }}
        initialData={editItem}
        title={editItem ? "Edit Stock Item" : "Add Stock Item"}
      />
    </div>
  );
}
