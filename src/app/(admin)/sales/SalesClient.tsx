"use client";

import React, { useState, useEffect } from "react";
import MasterTable from "@/components/master/MasterTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import { salesApi, Sale } from "@/api/sales";
import { customerApi, Customer } from "@/api/customer";

const columns = [
  { key: "date", header: "Date" },
  { key: "invoiceNo", header: "Invoice No." },
  { key: "customerName", header: "Customer Name" },
  { key: "totalFine", header: "Total Fine (Gms)" },
  { key: "amount", header: "Amount (₹)" },
];

export default function SalesClient() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    customerId: "",
    fromDate: "",
    toDate: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesData, customersData] = await Promise.all([
        salesApi.getAll(),
        customerApi.getAll(),
      ]);
      setSales(salesData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      customerId: "",
      fromDate: "",
      toDate: "",
    });
  };

  const filteredSales = sales.filter((sale) => {
    let matches = true;

    if (filters.customerId && sale.customerId !== filters.customerId) {
      matches = false;
    }

    if (filters.fromDate) {
      const saleDate = new Date(sale.saleDate);
      const fromDate = new Date(filters.fromDate);
      if (saleDate < fromDate) matches = false;
    }

    if (filters.toDate) {
      const saleDate = new Date(sale.saleDate);
      const toDate = new Date(filters.toDate);
      // Set to end of day
      toDate.setHours(23, 59, 59, 999);
      if (saleDate > toDate) matches = false;
    }

    return matches;
  });

  const tableData = filteredSales.map((sale) => ({
    id: sale.id,
    date: new Date(sale.saleDate).toLocaleDateString("en-GB"), // DD/MM/YYYY
    invoiceNo: sale.saleNo,
    customerName: sale.customer?.name || "-",
    totalFine: Number(sale.totalFineWt || 0).toFixed(3),
    amount: Number(sale.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  }));

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this sale?")) {
      try {
        await salesApi.delete(id);
        fetchData(); // Refresh list
      } catch (error) {
        console.error("Failed to delete sale:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Invoice</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage sales invoice records</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-3 mb-6 p-4 bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex flex-col gap-1 w-full sm:w-auto sm:flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Customer</label>
          <select
            name="customerId"
            value={filters.customerId}
            onChange={handleFilterChange}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From Date</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To Date</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            onClick={fetchData} // Refresh / Apply Filter (though filtering is live, refresh fetches new data)
            className="h-10 px-4 rounded-lg bg-purple-50 text-purple-600 font-medium hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400"
          >
            Filter
          </button>
          <button
            onClick={handleReset}
            className="h-10 px-4 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 dark:bg-gray-700"
          >
            Reset
          </button>
          
        </div>

        <div className="ml-auto mt-2 sm:mt-0">
          <Link href="/sales/add" className="h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500/20">
              <span>+</span>
             <span>Add New</span>
          </Link>
        </div>
      </div>

      <MasterTable
        columns={columns}
        data={tableData}
        onEdit={(row) => {
            // Navigate to edit page (if implemented later) or open modal
            console.log("Edit sale", row);
        }}
        onDelete={(row) => handleDelete(row.id)}
        onView={(row) => {
             console.log("View sale", row);
        }}
      />
    </div>
  );
}
