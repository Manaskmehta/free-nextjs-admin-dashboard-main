"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterTable from "@/components/master/MasterTable";
import MasterFormLayout from "@/components/master/MasterFormLayout";
import SchemaForm, { FieldSchema } from "@/components/master/SchemaForm";
import { accountsApi, Ledger, Voucher } from "@/api/accounts";
import { salesApi, Sale } from "@/api/sales";
import { customerApi, Customer } from "@/api/customer";
import { vendorApi, Vendor } from "@/api/vendor";

export default function AccountsClient() {
  const [activeTab, setActiveTab] = useState<"ledgers" | "vouchers" | "gst">("ledgers");
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "ledgers") {
        const data = await accountsApi.getLedgers();
        // Mock data if API returns empty (since backend might not exist yet)
        if (data.length === 0) {
            setLedgers([
                { id: "1", name: "Cash Account", group: "Assets", openingBalance: 50000, balanceType: "Dr", createdAt: "", updatedAt: "" },
                { id: "2", name: "HDFC Bank", group: "Assets", openingBalance: 150000, balanceType: "Dr", createdAt: "", updatedAt: "" },
                { id: "3", name: "Sales Account", group: "Income", openingBalance: 0, balanceType: "Cr", createdAt: "", updatedAt: "" },
            ]);
        } else {
            setLedgers(data);
        }
      } else if (activeTab === "vouchers") {
        const data = await accountsApi.getVouchers();
        setVouchers(data);
      } else if (activeTab === "gst") {
        const [salesData, customersData, vendorsData] = await Promise.all([
            salesApi.getAll(),
            customerApi.getAll(),
            vendorApi.getAll()
        ]);
        setSales(salesData);
        setCustomers(customersData);
        setVendors(vendorsData);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Columns ---
  const ledgerColumns = [
    { key: "name", header: "Ledger Name" },
    { key: "group", header: "Group" },
    { key: "openingBalance", header: "Opening Balance", render: (val: any, row: any) => `${val} ${row.balanceType}` },
  ];

  const voucherColumns = [
    { key: "date", header: "Date", render: (val: string) => new Date(val).toLocaleDateString() },
    { key: "voucherNo", header: "Voucher No" },
    { key: "type", header: "Type" },
    { key: "ledgerName", header: "Ledger" }, // Need to map
    { key: "amount", header: "Amount" },
    { key: "narration", header: "Narration" },
  ];

  const gstr1Columns = [
    { key: "gstin", header: "GSTIN/UIN" },
    { key: "receiverName", header: "Receiver Name" },
    { key: "invoiceNo", header: "Invoice No" },
    { key: "invoiceDate", header: "Date" },
    { key: "invoiceValue", header: "Invoice Value" },
    { key: "placeOfSupply", header: "Place Of Supply" },
    { key: "rate", header: "Rate" },
    { key: "taxableValue", header: "Taxable Value" },
    { key: "cess", header: "Cess Amount" },
  ];

  // --- Forms ---
  const getLedgerFields = (): FieldSchema[] => [
    { name: "name", label: "Ledger Name", type: "text", required: true },
    { 
        name: "group", 
        label: "Under Group", 
        type: "select", 
        required: true,
        options: [
            { label: "Capital Account", value: "Capital Account" },
            { label: "Current Assets", value: "Assets" },
            { label: "Current Liabilities", value: "Liabilities" },
            { label: "Sales Accounts", value: "Income" },
            { label: "Purchase Accounts", value: "Purchase" },
            { label: "Sundry Debtors", value: "Sundry Debtors" },
            { label: "Sundry Creditors", value: "Sundry Creditors" },
            { label: "Indirect Expenses", value: "Indirect Expenses" },
            { label: "Indirect Incomes", value: "Indirect Income" },
        ]
    },
    { name: "openingBalance", label: "Opening Balance", type: "number", required: true },
    { 
        name: "balanceType", 
        label: "Dr/Cr", 
        type: "select", 
        required: true, 
        options: [{ label: "Dr", value: "Dr" }, { label: "Cr", value: "Cr" }] 
    },
  ];

  const handleCreate = async () => {
    try {
        if (activeTab === "ledgers") {
            // await accountsApi.createLedger(formData);
            // Mock update
            setLedgers([...ledgers, { ...formData, id: Date.now().toString() }]);
        }
        setIsFormOpen(false);
        setFormData({});
    } catch (error) {
        console.error("Failed to create", error);
    }
  };

  // --- GST Data Processing ---
  const getGSTR1Data = () => {
    // GSTR-1: Outward Supplies (Sales)
    return sales.map(sale => {
        const customer = customers.find(c => c.id === sale.customerId);
        // Assuming GST is 3% for jewelry usually
        const taxRate = 3; 
        const taxableValue = sale.subTotal || 0;
        const invoiceValue = sale.grandTotal || 0;
        
        return {
            gstin: customer?.gstNo || "URP", // URP = Unregistered Person
            receiverName: customer?.name || "Cash Customer",
            invoiceNo: sale.saleNo,
            invoiceDate: new Date(sale.saleDate).toLocaleDateString(),
            invoiceValue: `₹${Number(invoiceValue || 0).toFixed(2)}`,
            placeOfSupply: customer?.state || "Local",
            rate: `${taxRate}%`,
            taxableValue: `₹${Number(taxableValue || 0).toFixed(2)}`,
            cess: "0.00"
        };
    });
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Accounts & GST" />

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("ledgers")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "ledgers"
                ? "border-b-2 border-brand-500 text-brand-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Ledgers
          </button>
          <button
            onClick={() => setActiveTab("vouchers")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "vouchers"
                ? "border-b-2 border-brand-500 text-brand-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Vouchers
          </button>
          <button
            onClick={() => setActiveTab("gst")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "gst"
                ? "border-b-2 border-brand-500 text-brand-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            GST Reports
          </button>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {activeTab === "ledgers" && "Chart of Accounts"}
            {activeTab === "vouchers" && "Day Book"}
            {activeTab === "gst" && "GST Returns Summary"}
        </h2>
        {activeTab === "ledgers" && (
            <button
                onClick={() => setIsFormOpen(true)}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
                + Create Ledger
            </button>
        )}
      </div>

      {activeTab === "ledgers" && (
        <MasterTable
            columns={ledgerColumns}
            data={ledgers}
            onEdit={() => {}}
            onDelete={() => {}}
            onView={() => {}}
        />
      )}

      {activeTab === "vouchers" && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900">
            <p>Voucher entry system coming soon.</p>
        </div>
      )}

      {activeTab === "gst" && (
        <div className="space-y-8">
            {/* GSTR-1 Section */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">GSTR-1 (Sales / Outward Supplies)</h3>
                </div>
                <div className="p-6">
                    <MasterTable
                        columns={gstr1Columns}
                        data={getGSTR1Data()}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onView={() => {}}
                        showActions={false}
                    />
                </div>
            </div>

            {/* GSTR-3B Summary Card */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">GSTR-3B (Summary)</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500">Total Outward Taxable Supplies</p>
                        <p className="text-xl font-bold mt-1">
                            ₹{sales.reduce((sum, s) => sum + Number(s.subTotal || 0), 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500">Total IGST</p>
                        <p className="text-xl font-bold mt-1 text-green-600">
                             ₹{sales.reduce((sum, s) => sum + Number(s.totalTax || 0), 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500">Total CGST</p>
                        <p className="text-xl font-bold mt-1 text-green-600">₹0.00</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500">Total SGST</p>
                        <p className="text-xl font-bold mt-1 text-green-600">₹0.00</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      <MasterFormLayout
        isOpen={isFormOpen}
        title="Create New Ledger"
        onClose={() => setIsFormOpen(false)}
        onSave={handleCreate}
      >
        <SchemaForm
            fields={getLedgerFields()}
            values={formData}
            onChange={(name, value) => setFormData({ ...formData, [name]: value })}
        />
      </MasterFormLayout>
    </div>
  );
}
