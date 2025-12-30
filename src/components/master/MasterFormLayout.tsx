import React from "react";
import { CloseIcon } from "@/icons";

interface MasterFormLayoutProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  onSave: () => void;
}

const MasterFormLayout: React.FC<MasterFormLayoutProps> = ({
  isOpen,
  title,
  onClose,
  children,
  onSave,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal Container - Centered */}
      <div
        className={`fixed inset-0 z-[99999] flex items-center justify-center transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop - blurred and darkened */}
        <div 
          className={`absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />

        {/* Modal Content */}
        <div
          className={`relative w-[90%] md:w-[70%] h-[70vh] bg-white shadow-2xl rounded-xl flex flex-col pointer-events-auto transform transition-all duration-300 dark:bg-gray-900 ${
             isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex justify-end gap-3 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/20"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MasterFormLayout;
