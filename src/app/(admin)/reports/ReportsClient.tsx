"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterTable from "@/components/master/MasterTable";
import { salesApi, Sale } from "@/api/sales";
import { orderApi, Order } from "@/api/order";
import { stockApi, StockItem } from "@/api/stock";

// Simple Card Component for Summary Stats
const StatCard = ({ title, value, subValue, icon }: any) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        {subValue && <p className="mt-1 text-sm text-green-500">{subValue}</p>}
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-500">
        {icon}
      </div>
    </div>
  </div>
);

// Icons
const SalesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
);
const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);
const StockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);

export default function ReportsClient() {
  const [activeTab, setActiveTab] = useState<"sales" | "orders" | "stock">("sales");
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesData, ordersData, stockData] = await Promise.all([
          salesApi.getAll(),
          orderApi.getAll(),
          stockApi.getAll(),
        ]);
        setSales(salesData);
        setOrders(ordersData);
        setStock(stockData);
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Calculations ---

  // Sales Stats
  const totalSalesAmount = sales.reduce((sum, sale) => sum + (Number(sale.grandTotal) || 0), 0);
  const totalSalesCount = sales.length;
  const averageSaleValue = totalSalesCount > 0 ? totalSalesAmount / totalSalesCount : 0;

  // Order Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "PENDING").length;
  const completedOrders = orders.filter(o => o.status === "COMPLETED" || o.status === "CONFIRMED").length;

  // Stock Stats
  const totalStockItems = stock.length;
  const availableStock = stock.filter(s => s.status === "AVAILABLE").length;
  const totalStockValue = stock.reduce((sum, item) => sum + (Number(item.approxSalesPrice) || 0), 0);
  const totalGrossWeight = stock.reduce((sum, item) => sum + (Number(item.grossWeight) || 0), 0);

  // --- Columns Definitions ---

  const salesColumns = [
    { key: "saleNo", header: "Sale No" },
    { key: "saleDate", header: "Date", render: (val: string) => new Date(val).toLocaleDateString() },
    { key: "customerName", header: "Customer" },
    { key: "salesmanName", header: "Salesman" },
    { key: "grandTotal", header: "Amount", render: (val: any) => `₹${Number(val || 0).toFixed(2)}` },
  ];

  const ordersColumns = [
    { key: "orderNumber", header: "Order No" },
    { key: "orderType", header: "Type" },
    { key: "customerName", header: "Customer" },
    { key: "status", header: "Status" },
    { key: "deliveryDate", header: "Delivery", render: (val: string) => new Date(val).toLocaleDateString() },
    { key: "totalQuantity", header: "Qty" },
  ];

  const stockColumns = [
    { key: "huid", header: "HUID" },
    { key: "category", header: "Category" },
    { key: "grossWeight", header: "Gross Wt (g)" },
    { key: "netWeight", header: "Net Wt (g)" },
    { key: "status", header: "Status" },
    { key: "approxSalesPrice", header: "Approx Price", render: (val: any) => `₹${Number(val || 0).toFixed(2)}` },
  ];

  // --- Data Mapping for Tables ---

  const salesTableData = sales.map(s => ({
    ...s,
    customerName: s.customer?.name || "-",
    salesmanName: s.salesman?.name || "-",
  }));

  const ordersTableData = orders.map(o => ({
    ...o,
    customerName: o.customer?.name || "-",
  }));

  const stockTableData = stock.map(s => ({
    ...s,
    category: s.category?.name || "-",
  }));

  if (loading) {
    return <div className="p-6">Loading reports data...</div>;
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Reports" />

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("sales")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "sales"
                ? "border-b-2 border-brand-500 text-brand-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Sales Reports
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "orders"
                ? "border-b-2 border-brand-500 text-brand-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Order Reports
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "stock"
                ? "border-b-2 border-brand-500 text-brand-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Stock Reports
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        
        {/* Sales View */}
        {activeTab === "sales" && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <StatCard 
                title="Total Revenue" 
                value={`₹${totalSalesAmount.toFixed(2)}`} 
                icon={<SalesIcon />} 
              />
              <StatCard 
                title="Total Sales Count" 
                value={totalSalesCount} 
                icon={<SalesIcon />} 
              />
              <StatCard 
                title="Avg. Sale Value" 
                value={`₹${averageSaleValue.toFixed(2)}`} 
                icon={<SalesIcon />} 
              />
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Sales History</h3>
                <MasterTable
                  columns={salesColumns}
                  data={salesTableData}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onView={() => {}}
                  showActions={false}
                />
              </div>
            </div>
          </>
        )}

        {/* Orders View */}
        {activeTab === "orders" && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <StatCard 
                title="Total Orders" 
                value={totalOrders} 
                icon={<OrderIcon />} 
              />
              <StatCard 
                title="Pending Orders" 
                value={pendingOrders} 
                subValue="Needs Attention"
                icon={<OrderIcon />} 
              />
              <StatCard 
                title="Completed Orders" 
                value={completedOrders} 
                icon={<OrderIcon />} 
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Details</h3>
                <MasterTable
                  columns={ordersColumns}
                  data={ordersTableData}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onView={() => {}}
                />
              </div>
            </div>
          </>
        )}

        {/* Stock View */}
        {activeTab === "stock" && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <StatCard 
                title="Total Items" 
                value={totalStockItems} 
                icon={<StockIcon />} 
              />
              <StatCard 
                title="Available Items" 
                value={availableStock} 
                icon={<StockIcon />} 
              />
              <StatCard 
                title="Total Value" 
                value={`₹${totalStockValue.toFixed(2)}`} 
                icon={<StockIcon />} 
              />
              <StatCard 
                title="Total Gross Wt." 
                value={`${totalGrossWeight.toFixed(2)} g`} 
                icon={<StockIcon />} 
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Stock Inventory</h3>
                <MasterTable
                  columns={stockColumns}
                  data={stockTableData}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onView={() => {}}
                  showActions={false}
                />
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
