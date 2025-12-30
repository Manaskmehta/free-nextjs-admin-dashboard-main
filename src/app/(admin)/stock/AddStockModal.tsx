"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { MaterialType } from "@/api/materialType";
import { Category } from "@/api/category";
import { Size } from "@/api/size";
import { Purity } from "@/api/purity";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  dependencies: {
    materialTypes: MaterialType[];
    categories: Category[];
    sizes: Size[];
    purities: Purity[];
  };
  initialData?: any; // New prop for editing
  title?: string; // Customizable title
}

export const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dependencies,
  initialData,
  title = "Add Stock Item"
}) => {
  const { materialTypes, categories, sizes, purities } = dependencies;
  
  const [formData, setFormData] = useState({
    materialTypeId: "",
    categoryId: "",
    barcode: "",
    sizeId: "",
    purityId: "",
    pieces: "",
    grossWeight: "",
    stoneWeight: "",
    netWeight: "",
    wastagePercent: "",
    fineWeight: "",
    huid: "",
    stoneCost: "",
    approxSalesPrice: "",
    status: "AVAILABLE",
    salesVoucherNo: "",
    orderNo: "",
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        ...initialData,
        // Ensure values are strings or numbers, handling potentially missing fields
        materialTypeId: initialData.materialTypeId || "",
        categoryId: initialData.categoryId || "",
        barcode: initialData.barcode || initialData.barcodeDetails?.barcode || "",
        sizeId: initialData.sizeId || "",
        purityId: initialData.purityId || "",
        pieces: initialData.pieces || "",
        grossWeight: initialData.grossWeight || "",
        stoneWeight: initialData.stoneWeight || "",
        netWeight: initialData.netWeight || "",
        wastagePercent: initialData.wastagePercent || "",
        fineWeight: initialData.fineWeight || "",
        huid: initialData.huid || "",
        stoneCost: initialData.stoneCost || "",
        approxSalesPrice: initialData.approxSalesPrice || "",
        status: initialData.status || "AVAILABLE",
        salesVoucherNo: initialData.salesVoucherNo || "",
        orderNo: initialData.orderNo || "",
      });
    } else if (isOpen && !initialData) {
        // Reset to empty if opening as Add
         setFormData({
            materialTypeId: "",
            categoryId: "",
            barcode: "",
            sizeId: "",
            purityId: "",
            pieces: "",
            grossWeight: "",
            stoneWeight: "",
            netWeight: "",
            wastagePercent: "",
            fineWeight: "",
            huid: "",
            stoneCost: "",
            approxSalesPrice: "",
            status: "AVAILABLE",
            salesVoucherNo: "",
            orderNo: "",
          });
    }
  }, [isOpen, initialData]);

  const [loading, setLoading] = useState(false);

  const calculateNetAndFineWeight = (gross: string, stone: string, purityId: string) => {
    const grossVal = parseFloat(gross) || 0;
    const stoneVal = parseFloat(stone) || 0;
    const net = grossVal - stoneVal;
    
    // Find purity percent
    const purity = purities.find(p => p.id === purityId);
    const purityPercent = purity ? purity.purityPercent : 0;
    
    const fine = (net * purityPercent) / 100;

    return {
      netWeight: net > 0 ? net.toFixed(3) : "",
      fineWeight: fine > 0 ? fine.toFixed(3) : ""
    };
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Auto-calculate logic
      if (name === "grossWeight" || name === "stoneWeight" || name === "purityId") {
        const { netWeight, fineWeight } = calculateNetAndFineWeight(
          name === "grossWeight" ? value : prev.grossWeight,
          name === "stoneWeight" ? value : prev.stoneWeight,
          name === "purityId" ? value : prev.purityId
        );
        newData.netWeight = netWeight;
        newData.fineWeight = fineWeight;
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
      // Reset form
      setFormData({
        materialTypeId: "",
        categoryId: "",
        barcode: "",
        sizeId: "",
        purityId: "",
        pieces: "",
        grossWeight: "",
        stoneWeight: "",
        netWeight: "",
        wastagePercent: "",
        fineWeight: "",
        huid: "",
        stoneCost: "",
        approxSalesPrice: "",
        status: "AVAILABLE",
        salesVoucherNo: "",
        orderNo: "",
      });
    } catch (error) {
      console.error("Failed to save stock item", error);
      // Ideally show error message
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "Available", value: "AVAILABLE" },
    { label: "Reserved", value: "RESERVED" },
    { label: "Sold", value: "SOLD" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-full w-[95vw] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw]">
      <div className="p-6">
        <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        
        <div className="overflow-x-auto pb-4">
          <table className="min-w-max border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Material Type*</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Category*</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Barcode</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Size</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Purity*</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Pieces*</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Gross Wt*</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Stone Wt</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Net Wt*</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Wastage %</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Fine Wt</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">HUID</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Stone Cost</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Sales Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">
                  <Select
                    options={materialTypes.map((m) => ({ label: m.typeName, value: m.id }))}
                    value={formData.materialTypeId}
                    onChange={(val) => handleChange("materialTypeId", val)}
                    placeholder="Select"
                    className="h-10 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Select
                    options={categories.map((c) => ({ label: c.name, value: c.id }))}
                    value={formData.categoryId}
                    onChange={(val) => handleChange("categoryId", val)}
                    placeholder="Select"
                    className="h-10 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={formData.barcode}
                    onChange={(e) => handleChange("barcode", e.target.value)}
                    placeholder="Auto/Scan"
                    className="h-10 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Select
                    options={sizes.map((s) => ({ label: s.sizeLabel, value: s.id }))}
                    value={formData.sizeId}
                    onChange={(val) => handleChange("sizeId", val)}
                    placeholder="Select"
                    className="h-10 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Select
                    options={purities.map((p) => ({ label: `${p.purityLabel} (${p.purityPercent}%)`, value: p.id }))}
                    value={formData.purityId}
                    onChange={(val) => handleChange("purityId", val)}
                    placeholder="Select"
                    className="h-10 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={formData.pieces}
                    onChange={(e) => handleChange("pieces", e.target.value)}
                    placeholder="0"
                    className="h-10 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={formData.grossWeight}
                    onChange={(e) => handleChange("grossWeight", e.target.value)}
                    placeholder="0.00"
                    step={0.01}
                    className="h-10 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={formData.stoneWeight}
                    onChange={(e) => handleChange("stoneWeight", e.target.value)}
                    placeholder="0.00"
                    step={0.01}
                    className="h-10 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={formData.netWeight}
                    onChange={(e) => handleChange("netWeight", e.target.value)}
                    placeholder="0.00"
                    step={0.01}
                    className="h-10 text-sm"
                    disabled
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={formData.wastagePercent}
                    onChange={(e) => handleChange("wastagePercent", e.target.value)}
                    placeholder="0"
                    step={0.01}
                    className="h-10 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={formData.fineWeight}
                    onChange={(e) => handleChange("fineWeight", e.target.value)}
                    placeholder="0.00"
                    step={0.01}
                    className="h-10 text-sm"
                    disabled
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={formData.huid}
                    onChange={(e) => handleChange("huid", e.target.value)}
                    placeholder="HUID"
                    className="h-10 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={formData.stoneCost}
                    onChange={(e) => handleChange("stoneCost", e.target.value)}
                    placeholder="0.00"
                    className="h-10 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={formData.approxSalesPrice}
                    onChange={(e) => handleChange("approxSalesPrice", e.target.value)}
                    placeholder="0.00"
                    className="h-10 text-sm"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
