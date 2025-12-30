"use client";

import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterTable from "./MasterTable";
import MasterFormLayout from "./MasterFormLayout";
import SchemaForm, { FieldSchema } from "./SchemaForm";
import { Alert } from "@/components/ui/alert/Alert";

interface MasterContainerProps {
  title: string;
  description: string;
  columns: any[];
  fields: FieldSchema[];
  initialData?: any[];
  addButtonLabel?: string;
  onFetchData?: () => Promise<any[]>;
  onCreate?: (data: any) => Promise<any>;
  onUpdate?: (id: string, data: any) => Promise<any>;
  onDelete?: (id: string) => Promise<any>;
  onFormOpen?: () => void; // New prop to trigger actions when form opens
  hideToolbar?: boolean;
  externalSearchQuery?: string;
  onCustomEdit?: (row: any) => void; // New prop for custom edit behavior
}

export interface MasterContainerRef {
  handleAdd: () => void;
  loadData: () => Promise<void>;
}

const MasterContainer = forwardRef<MasterContainerRef, MasterContainerProps>(({
  title,
  description,
  columns,
  fields,
  initialData = [],
  addButtonLabel = "Add New",
  onFetchData,
  onCreate,
  onUpdate,
  onDelete,
  onFormOpen,
  hideToolbar = false,
  externalSearchQuery,
  onCustomEdit,
}, ref) => {
  const [data, setData] = useState(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use external search query if provided, otherwise local state
  const effectiveSearchQuery = externalSearchQuery !== undefined ? externalSearchQuery : searchQuery;

  useEffect(() => {
    if (onFetchData) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    if (!onFetchData) return;
    setLoading(true);
    try {
      const result = await onFetchData();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentId(null);
    setFormValues({});
    setIsFormOpen(true);
    setError(null);
    if (onFormOpen) onFormOpen(); // Trigger fetchDependencies if provided
  };

  useImperativeHandle(ref, () => ({
    handleAdd,
    loadData
  }));

  const handleEdit = (row: any) => {
    if (onCustomEdit) {
      onCustomEdit(row);
      return;
    }
    setCurrentId(row.id);
    setFormValues(row);
    setIsFormOpen(true);
    setError(null);
    if (onFormOpen) onFormOpen(); // Trigger fetchDependencies if provided
  };

  const handleDelete = async (row: any) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        if (onDelete) {
          await onDelete(row.id);
          // Refresh data or remove from local state
          setData((prev) => prev.filter((item) => item.id !== row.id));
        } else {
          // Local delete
          setData((prev) => prev.filter((item) => item.id !== row.id));
        }
      } catch (err: any) {
        setError(err.message || "Failed to delete item");
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      if (currentId) {
        // Update
        if (onUpdate) {
          const updatedItem = await onUpdate(currentId, formValues);
          setData((prev) =>
            prev.map((item) => (item.id === currentId ? updatedItem : item))
          );
        } else {
          // Local update
          setData((prev) =>
            prev.map((item) => (item.id === currentId ? { ...formValues, id: currentId } : item))
          );
        }
      } else {
        // Create
        if (onCreate) {
          const newItem = await onCreate(formValues);
          setData((prev) => [...prev, newItem]);
        } else {
          // Local create
          const newItem = { ...formValues, id: Math.random().toString(36).substring(2, 9) };
          setData((prev) => [...prev, newItem]);
        }
      }
      setIsFormOpen(false);
      setFormValues({}); // Clear form after successful save
      setCurrentId(null); // Reset current ID
    } catch (err: any) {
      setError(err.message || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (name: string, value: any) => {
    setFormValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(effectiveSearchQuery.toLowerCase())
    )
  );

  return (
    <div>
      <PageBreadcrumb pageTitle={title} />
      
      {error && (
        <div className="mb-4">
          <Alert variant="error" title="Error" message={error} />
        </div>
      )}

      {!hideToolbar && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
          <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Search..." 
                className="h-10 rounded-lg border border-gray-300 px-4 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {addButtonLabel && (
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
                >
                  <span>+</span>
                  <span> {addButtonLabel.startsWith("+") ? addButtonLabel.substring(1).trim() : addButtonLabel}</span>
                </button>
              )}
          </div>
        </div>
      )}

      <MasterTable
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={(row) => {
           handleEdit(row); // Reusing edit for view for now, usually would be readonly
        }}
      />

      <MasterFormLayout
        isOpen={isFormOpen}
        title={currentId ? `Edit ${title}` : `Add ${title}`}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      >
        <SchemaForm
          fields={fields}
          values={formValues}
          onChange={handleFormChange}
        />
      </MasterFormLayout>
    </div>
  );
});

MasterContainer.displayName = "MasterContainer";

export default MasterContainer;
