"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Trash2, Printer, Save } from "lucide-react";
import InputField from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import { customerApi, Customer } from "@/api/customer";
import { salesApi } from "@/api/sales";
import { useRouter } from "next/navigation";
import { barcodeApi, BarcodeDetails } from "@/api/barcode";

// --- Types ---
// Removed local Customer interface to use API type

interface SalesItem {
  id: string;
  stockItemId?: string; // Hidden ID
  barcodeDetailsId?: string; // Hidden ID
  categoryId?: string; // Hidden ID
  hsnId?: string | null; // Hidden ID
  
  category: string;
  barcode: string;
  particulars: string;
  hsn: string;
  pieces: number;
  size: string;
  purity: string;
  grossWeight: number;
  otherWeight: number;
  netWeight: number;
  fine: number;
  wastage: number;
  totalFine: number;
  rateOn: string;
  metalPrice: number;
  metalRate: number;
  labourOn: string;
  labour: number;
  amount: number;
}

// --- Mock Data Removed ---

const MOCK_ITEMS_DB = [
  { barcode: "1001", category: "Ring", particulars: "Gold Ring", hsn: "7113", purity: "22K" },
  { barcode: "1002", category: "Bangle", particulars: "Gold Bangle", hsn: "7113", purity: "22K" },
  { barcode: "1003", category: "Chain", particulars: "Gold Chain", hsn: "7113", purity: "22K" },
];

export default function AddSalesInvoice() {
  // --- State ---
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);
  const [rates, setRates] = useState({ gold: 7500, silver: 85 });
  const [barcodeInput, setBarcodeInput] = useState("");
  const [items, setItems] = useState<SalesItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BarcodeDetails[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Footer State
  const [narration, setNarration] = useState({ jewelry: "", account: "" });
  const [totals, setTotals] = useState({ subTotal: 0, gst: 0, finalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await customerApi.getAll();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // --- Handlers ---
  
  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (barcodeInput.trim()) {
        setIsSearching(true);
        try {
          const results = await barcodeApi.search(barcodeInput);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error searching barcode:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [barcodeInput]);

  const handleCustomerChange = (val: string) => {
    if (val === "NEW_CUSTOMER") {
       return;
    }
    setSelectedCustomerId(val);
    const cust = customers.find((c) => c.id === val) || null;
    setCustomerDetails(cust);
  };

  const addItemFromDetails = (found: BarcodeDetails) => {
    // Check if item already added
    if (items.some(item => item.barcode === found.barcode)) {
       setBarcodeInput("");
      setShowDropdown(false);
      return;
    }

    const stockItem = found.stockItems && found.stockItems.length > 0 ? found.stockItems[0] : null;

    const newItem: SalesItem = {
      id: Date.now().toString(),
      // Store hidden IDs for payload
      stockItemId: stockItem?.id,
      barcodeDetailsId: found.id,
      categoryId: found.category?.id,
      hsnId: found.category?.hsnId,
      
      category: found.category?.name || "Unknown",
      barcode: found.barcode,
      particulars: found.category?.description || "",
      hsn: found.category?.hsnId || "",
      pieces: found.pieces,
      size: stockItem?.size?.sizeLabel || "",
      purity: found.purity?.purityPercent ? `${found.purity.purityPercent}%` : (found.purity?.purityLabel || ""),
      grossWeight: parseFloat(found.grossWeight) || 0,
      otherWeight: parseFloat(found.stoneWeight) || 0,
      netWeight: parseFloat(found.netWeight) || 0,
      fine: parseFloat(found.fineWeight) || 0,
      wastage: parseFloat(found.wastagePercent) || 0,
      totalFine: parseFloat(found.fineWeight) || 0,
      rateOn: "Weight",
      metalPrice: rates.gold,
      metalRate: rates.gold,
      labourOn: "Piece",
      labour: 0,
      amount: 0,
    };

    // Calculate initial amount
    newItem.amount = (newItem.netWeight * newItem.metalRate) + newItem.labour;

    setItems([...items, newItem]);
    setBarcodeInput("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleBarcodeSearch = async () => {
    // Manual trigger (e.g. Enter key or Button) - Select first result if available
    if (searchResults.length > 0) {
      addItemFromDetails(searchResults[0]);
    } else if (barcodeInput.trim()) {
      // Force immediate search if no results yet (e.g. pasted fast)
      setIsSearching(true);
      try {
        const results = await barcodeApi.search(barcodeInput);
        if (results && results.length > 0) {
          addItemFromDetails(results[0]);
        } else {
         }
      } catch (error) {
        console.error("Error searching barcode:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const updateItem = (id: string, field: keyof SalesItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      
      const updated = { ...item, [field]: value };
      
      // Auto-calculate Net Weight
      if (field === 'grossWeight' || field === 'otherWeight') {
        updated.netWeight = updated.grossWeight - updated.otherWeight;
      }

      // Simple Amount Calc (Demo Logic)
      // Amount = (NetWeight * MetalRate) + Labour
      if (field === 'netWeight' || field === 'metalRate' || field === 'labour') {
        updated.amount = (updated.netWeight * updated.metalRate) + updated.labour;
      }

      return updated;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSave = async () => {
    if (!selectedCustomerId || items.length === 0) {
       return;
    }

    setLoading(true);
    try {
      const payload = {
        saleNo: `SALE-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        saleDate: new Date().toISOString(),
        customerId: selectedCustomerId,
        salesmanId: "", // Empty as requested
        totalGrossWt: items.reduce((sum, item) => sum + item.grossWeight, 0),
        totalNetWt: items.reduce((sum, item) => sum + item.netWeight, 0),
        totalFineWt: items.reduce((sum, item) => sum + item.totalFine, 0),
        stoneAmount: items.reduce((sum, item) => sum + item.otherWeight, 0),
        makingAmount: items.reduce((sum, item) => sum + item.labour, 0),
        wastageAmount: items.reduce((sum, item) => sum + item.wastage, 0),
        subTotal: totals.subTotal,
        totalTax: totals.gst,
        roundOff: 0,
        grandTotal: totals.finalAmount,
        notes: narration.jewelry + (narration.account ? ` | ${narration.account}` : ""),
        items: items.map(item => ({
             stockItemId: (item as any).stockItemId,
             barcodeId: (item as any).barcodeDetailsId,
             categoryId: (item as any).categoryId,
             hsnId: (item as any).hsnId || null,
             pieces: item.pieces,
             grossWeight: item.grossWeight,
             netWeight: item.netWeight,
             fineWeight: item.fine,
             metalRate: item.metalRate,
             metalAmount: item.amount - item.labour,
             stoneAmount: 0,
             makingAmount: item.labour,
             taxableAmount: item.amount,
             gstPercent: 3,
             cgstAmount: (item.amount * 0.015),
             sgstAmount: (item.amount * 0.015),
             igstAmount: 0,
             lineTotal: item.amount * 1.03
        }))
      };

      await salesApi.create(payload);
       router.push("/sales");
    } catch (error) {
      console.error("Failed to save sale:", error);
     } finally {
      setLoading(false);
    }
  };

  // Recalculate Totals
  useEffect(() => {
    const sub = items.reduce((acc, curr) => acc + curr.amount, 0);
    const gst = sub * 0.03; // 3% GST
    setTotals({
      subTotal: sub,
      gst: gst,
      finalAmount: sub + gst
    });
  }, [items]);

  // --- Render ---

  return (
    <div className="mx-auto max-w-full p-4 md:p-6 2xl:p-10 w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black dark:text-white">
            Add Sales Invoice
          </h2>
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Manage invoice entries, save & print
          </p>
        </div>
        <Link
          href="/sales"
          className="inline-flex items-center justify-center gap-2.5 rounded-md bg-gray-100 px-6 py-3 text-center font-medium text-gray-900 hover:bg-gray-200 lg:px-6 xl:px-8 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        
        {/* Card 1: Customer & Invoice Details */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-500 dark:bg-gray-800">
          <div className="border-b border-stroke px-4 py-3 dark:border-gray-500">
            <h3 className="font-medium text-black dark:text-white">
              Invoice Details
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              
              {/* Date */}
              <div>
                <Label className="dark:text-white">Date</Label>
                <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-gray-500 dark:bg-gray-900 dark:focus:border-brand-500 dark:text-white"
                    defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Invoice No */}
              <div>
                 <Label className="dark:text-white">Invoice No.</Label>
                 <InputField placeholder="INV-2024-001" disabled className="!dark:border-gray-500 !dark:text-white" />
              </div>

              {/* Customer Dropdown */}
              <div className="sm:col-span-2 lg:col-span-2">
                <Label className="dark:text-white">Customer Name</Label>
                <div className="flex gap-2">
                    <div className="flex-grow">
                        <Select
                            options={[
                                ...customers.map(c => ({ value: c.id, label: c.name })),
                                { value: "NEW_CUSTOMER", label: "+ Create New Customer" }
                            ]}
                            placeholder="Select Customer"
                            onChange={handleCustomerChange}
                            value={selectedCustomerId}
                            className="!dark:border-gray-500 !dark:text-white"
                        />
                    </div>
                </div>
              </div>

              {/* PAN & GST (Autofilled) */}
              <div>
                <Label className="dark:text-white">PAN No.</Label>
                <InputField placeholder="PAN Number" value={customerDetails?.panNo || ""} disabled className="!dark:border-gray-500 !dark:text-white" />
              </div>
              <div>
                <Label className="dark:text-white">GST No.</Label>
                <InputField placeholder="GSTIN" value={customerDetails?.gstNo || ""} disabled className="!dark:border-gray-500 !dark:text-white" />
              </div>

              {/* Rates */}
              <div>
                <Label className="dark:text-white">Gold Rate (10g)</Label>
                <InputField 
                    type="number" 
                    value={rates.gold} 
                    onChange={(e) => setRates({...rates, gold: Number(e.target.value)})}
                    className="!dark:border-gray-500 !dark:text-white"
                />
              </div>
              <div>
                <Label className="dark:text-white">Silver Rate (10g)</Label>
                <InputField 
                    type="number" 
                    value={rates.silver} 
                    onChange={(e) => setRates({...rates, silver: Number(e.target.value)})}
                    className="!dark:border-gray-500 !dark:text-white"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Card 2: Items Table */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-500 dark:bg-gray-800">
            
            {/* Barcode Search Header */}
            <div className="border-b border-stroke px-4 py-3 dark:border-gray-500 flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Scan Barcode or Type Item Code..."
                            className="w-full rounded-lg border border-gray-300 bg-transparent py-2 pl-4 pr-4 outline-none focus:border-brand-500 text-black placeholder:text-gray-500 dark:border-gray-500 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400"
                            value={barcodeInput}
                            onChange={(e) => setBarcodeInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                            disabled={isSearching}
                        />
                        {/* Autocomplete Dropdown */}
                        {showDropdown && searchResults.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {searchResults.map((result) => (
                              <button
                                key={result.id}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 last:border-0"
                                onClick={() => addItemFromDetails(result)}
                              >
                                <span>{result.barcode} - {result.category?.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{result.grossWeight}g</span>
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                    <button 
                        onClick={handleBarcodeSearch}
                        disabled={isSearching}
                        className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
                    >
                        {isSearching ? "Scanning..." : (
                            <>
                                <Plus className="h-4 w-4" /> Add Item
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="p-4 max-w-full">
                <div className="w-full max-w-full overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-500">
                    <table className="min-w-[1200px] w-full text-left text-sm text-gray-600 dark:text-white">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-white">
                            <tr>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Barcode</th>
                                <th className="px-4 py-3">Particulars</th>
                                <th className="px-4 py-3 w-20">HSN</th>
                                <th className="px-4 py-3 w-16">Pcs</th>
                                <th className="px-4 py-3 w-20">Size</th>
                                <th className="px-4 py-3 w-20">Purity</th>
                                <th className="px-4 py-3 w-24">Gr. Wt</th>
                                <th className="px-4 py-3 w-24">Oth. Wt</th>
                                <th className="px-4 py-3 w-24">Net Wt</th>
                                <th className="px-4 py-3 w-24">Metal Rate</th>
                                <th className="px-4 py-3 w-24">Labour</th>
                                <th className="px-4 py-3 w-28">Amount</th>
                             </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-500">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={14} className="px-4 py-8 text-center text-gray-500 dark:text-white">
                                        No items added. Scan a barcode to begin.
                                    </td>
                                </tr>
                            ) : items.map((item) => (
                                <tr key={item.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-2 py-2"><input type="text" className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm dark:text-white" value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)} /></td>
                                    <td className="px-2 py-2"><span className="text-gray-500 dark:text-white">{item.barcode}</span></td>
                                    <td className="px-2 py-2"><input type="text" className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm dark:text-white" value={item.particulars} onChange={(e) => updateItem(item.id, 'particulars', e.target.value)} /></td>
                                    <td className="px-2 py-2"><input type="text" className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm dark:text-white" value={item.hsn} onChange={(e) => updateItem(item.id, 'hsn', e.target.value)} /></td>
                                    <td className="px-2 py-2"><input type="number" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-500 focus:border-brand-500 p-1 text-sm dark:text-white" value={item.pieces} onChange={(e) => updateItem(item.id, 'pieces', Number(e.target.value))} /></td>
                                    <td className="px-2 py-2"><input type="text" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-500 focus:border-brand-500 p-1 text-sm dark:text-white" value={item.size} onChange={(e) => updateItem(item.id, 'size', e.target.value)} /></td>
                                    <td className="px-2 py-2"><input type="text" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-500 focus:border-brand-500 p-1 text-sm dark:text-white" value={item.purity} onChange={(e) => updateItem(item.id, 'purity', e.target.value)} /></td>
                                    
                                    {/* Weights */}
                                    <td className="px-2 py-2"><input type="number" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-500 focus:border-brand-500 p-1 text-sm font-medium dark:text-white" value={item.grossWeight} onChange={(e) => updateItem(item.id, 'grossWeight', Number(e.target.value))} /></td>
                                    <td className="px-2 py-2"><input type="number" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-500 focus:border-brand-500 p-1 text-sm dark:text-white" value={item.otherWeight} onChange={(e) => updateItem(item.id, 'otherWeight', Number(e.target.value))} /></td>
                                    <td className="px-2 py-2"><span className="font-bold text-gray-800 dark:text-white">{item.netWeight.toFixed(3)}</span></td>
                                    
                                    <td className="px-2 py-2"><input type="number" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-500 focus:border-brand-500 p-1 text-sm dark:text-white" value={item.metalRate} onChange={(e) => updateItem(item.id, 'metalRate', Number(e.target.value))} /></td>
                                    <td className="px-2 py-2"><input type="number" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-500 focus:border-brand-500 p-1 text-sm dark:text-white" value={item.labour} onChange={(e) => updateItem(item.id, 'labour', Number(e.target.value))} /></td>
                                    
                                    <td className="px-2 py-2"><span className="font-bold text-brand-600 dark:text-white">{item.amount.toFixed(2)}</span></td>
                                    
                                    <td className="px-2 py-2 text-center">
                                        <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Footer: Totals & Actions */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-500 dark:bg-gray-800">
            <div className="p-6.5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Narrations */}
                    <div className="lg:col-span-2 space-y-4">
                        <div>
                            <Label className="dark:text-white">Jewellery Narration</Label>
                            <TextArea 
                                placeholder="Enter details..." 
                                value={narration.jewelry}
                                onChange={(val) => setNarration({...narration, jewelry: val})}
                                className="!dark:border-gray-500 !dark:text-white"
                            />
                        </div>
                        <div>
                            <Label className="dark:text-white">Account Narration</Label>
                            <TextArea 
                                placeholder="Enter details..." 
                                value={narration.account}
                                onChange={(val) => setNarration({...narration, account: val})}
                                className="!dark:border-gray-500 !dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Right: Totals */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
                        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                            <span>Sub Total</span>
                            <span className="font-medium text-black dark:text-white">₹ {totals.subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                            <span>GST (3%)</span>
                            <span className="font-medium text-black dark:text-white">₹ {totals.gst.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                            <div className="flex justify-between items-center text-lg font-bold text-brand-600">
                                <span>Grand Total</span>
                                <span>₹ {totals.finalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <button className="flex items-center justify-center gap-2 w-full rounded-lg border border-brand-600 py-3 text-brand-600 hover:bg-brand-50 transition">
                                <Printer className="h-5 w-5" />
                                Print Preview
                            </button>
                            <button className="flex items-center justify-center gap-2 w-full rounded-lg bg-brand-600 py-3 text-white hover:bg-brand-700 transition shadow-md" onClick={handleSave} disabled={loading}>
                                <Save className="h-5 w-5" />
                                {loading ? "Saving..." : "Save & Print"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
