import React from "react";
import PageBreadcrumb from "./PageBreadCrumb";
import { BoxIcon } from "@/icons";

interface PageContainerProps {
  title: string;
  description: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, description }) => {
  return (
    <div>
      <PageBreadcrumb pageTitle={title} />
      <div className="mb-6">
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-800 min-h-[400px]">
        <div className="p-4 mb-4 bg-gray-100 rounded-full dark:bg-gray-800 text-gray-400 dark:text-gray-500">
           <BoxIcon className="w-12 h-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No content connected yet
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
          This page is currently a placeholder. Content integration will be added in future updates.
        </p>
      </div>
    </div>
  );
};

export default PageContainer;
