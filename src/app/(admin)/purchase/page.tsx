import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase | Macanx ERP",
  description: "Manage purchase records",
};

export default function PurchasePage() {
  return (
    <div className="flex h-[calc(100vh-200px)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Purchase Module</h1>
        <p className="text-gray-500 dark:text-gray-400">This feature is coming soon...</p>
      </div>
    </div>
  );
}
