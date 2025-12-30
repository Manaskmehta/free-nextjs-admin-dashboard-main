"use client";

import React, { useState, useEffect } from "react";
import MasterContainer from "@/components/master/MasterContainer";
import { FieldSchema } from "@/components/master/SchemaForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { designApi, Design } from "@/api/design";
import { customerApi, Customer } from "@/api/customer";
import { salesmanApi, Salesman } from "@/api/salesman";
import { orderApi, Order, CreateOrderPayload } from "@/api/order";

// Reusing the same columns structure as MasterTable
const columns = [
  { key: "orderId", header: "Order ID" },
  { key: "clientName", header: "Client Name" },
  { key: "orderType", header: "Order Type" },
  { key: "status", header: "Status" },
  { key: "deliveryDate", header: "Delivery Date" },
];

export default function OrdersClient() {
  const [activeTab, setActiveTab] = useState<"all" | "mobile">("all");
  const [orderType, setOrderType] = useState<"design" | "custom">("design");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [designsData, customersData, salesmenData, ordersData] = await Promise.all([
          designApi.getAll(),
          customerApi.getAll(),
          salesmanApi.getAll(),
          orderApi.getAll()
        ]);
        setDesigns(designsData);
        setCustomers(customersData);
        setSalesmen(salesmenData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleCreateOrder = async (data: any) => {
    try {
      let designId = undefined;
      let s3Key = undefined;

      if (data.orderTypeSelection === "design") {
         const selectedDesign = designs.find(d => d.designNo === data.designNo);
         designId = selectedDesign?.id;
         s3Key = selectedDesign?.s3Key;
      } else {
         s3Key = data.referenceImage;
      }

      const payload: CreateOrderPayload = {
        orderNumber: data.orderNumber,
        customerId: data.client,
        salesmanId: data.salesman,
        orderType: data.orderTypeSelection === "design" ? "DESIGN" : "CUSTOM",
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString() : new Date().toISOString(),
        remarks: data.remarks || data.description,
        items: [
          {
            designId: designId,
            approxNetWeight: Number(data.netWeight),
            approxGrossWeight: Number(data.grossWeight),
            otherWeight: Number(data.otherWeight || 0),
            quantity: Number(data.quantity || 1),
            customizationNotes: data.remarks || data.description,
            s3Key: s3Key
          }
        ]
      };
      
      await orderApi.create(payload);
      const ordersData = await orderApi.getAll();
      setOrders(ordersData);
      return true;
    } catch (error) {
      console.error("Failed to create order", error);
      return false;
    }
  };

  // This is a wrapper to inject the dynamic order type logic into the generic MasterContainer
  // In a real app, MasterContainer might need more flexibility, but we can compose it here.
  
  const getFields = () => {
    // We add a radio at the top to switch between Design / Custom order
    const typeSelector: FieldSchema = {
      name: "orderTypeSelection",
      label: "Order Type",
      type: "radio",
      options: [
        { label: "Design Wise Order", value: "design" },
        { label: "Custom Order", value: "custom" },
      ],
      // We'll handle the state change for this in the onChange handler of the container
    };

    const commonFields: FieldSchema[] = [
      {
        name: "orderNumber",
        label: "Order No",
        type: "text",
        required: true,
        placeholder: "e.g. ORD-2025-001"
      },
      { 
        name: "salesman", 
        label: "Salesman Details", 
        type: "select", 
        required: true, 
        placeholder: "Select salesman",
        options: salesmen.map(s => ({ label: s.name, value: s.id }))
      },
      { 
        name: "client", 
        label: "Client", 
        type: "select", 
        required: true,
        options: customers.map(c => ({ label: c.name, value: c.id }))
      },
      { 
        name: "deliveryDate", 
        label: "Delivery Date", 
        type: "date", 
        required: true 
      },
    ];

    const designOrderFields: FieldSchema[] = [
      ...commonFields,
      { 
        name: "designNo", 
        label: "Select Design", 
        type: "select", 
        required: true,
        placeholder: "Search Design No...",
        options: designs.map(d => ({
          label: `${d.designNo} (GWT: ${d.gwt}g)`,
          value: d.designNo
        })),
        hint: "Selecting a design will auto-fetch estimated weights"
      },
      { 
        name: "netWeight", 
        label: "Approx Net Weight (gms)", 
        type: "number", 
        placeholder: "0.000",
        disabled: true,
        hint: "Auto-fetched from Design Master"
      },
      { 
        name: "grossWeight", 
        label: "Approx Gross Weight (gms)", 
        type: "number", 
        placeholder: "0.000",
        disabled: true, 
        hint: "Auto-fetched from Design Master"
      },
      { 
        name: "otherWeight", 
        label: "Other Weight (gms)", 
        type: "number", 
        placeholder: "0.000",
        disabled: true, 
        hint: "Auto-fetched from Design Master"
      },
      { name: "quantity", label: "Quantity", type: "number", required: true, placeholder: "1" },
      { name: "remarks", label: "Remarks / Customization", type: "textarea" },
    ];

    const customOrderFields: FieldSchema[] = [
      ...commonFields,
      { name: "referenceImage", label: "Reference Image URL", type: "text", required: true, hint: "Enter image URL" },
      { name: "netWeight", label: "Estimated Net Weight (gms)", type: "number", placeholder: "0.000", required: true },
      { name: "grossWeight", label: "Estimated Gross Weight (gms)", type: "number", placeholder: "0.000", required: true },
      { name: "otherWeight", label: "Other Weight (gms)", type: "number", placeholder: "0.000" },
      { name: "description", label: "Design Description", type: "textarea", required: true, placeholder: "Describe the custom design requirements..." },
    ];

    return [typeSelector, ...(orderType === "design" ? designOrderFields : customOrderFields)];
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Orders" />
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "border-b-2 border-brand-500 text-brand-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveTab("mobile")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "mobile"
                ? "border-b-2 border-brand-500 text-brand-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Mobile Orders
          </button>
        </div>
      </div>

      {/* 
        We are reusing MasterContainer but hijacking the fields prop to be dynamic.
        We need to make sure MasterContainer can handle re-rendering when fields change.
      */}
      <MasterContainerWrapper 
        key={activeTab} // Force re-render on tab change
        title={activeTab === "all" ? "All Orders" : "Mobile App Orders"}
        description={activeTab === "all" ? "Manage all customer orders" : "Orders received from mobile app"}
        columns={columns}
        // Only show Add button on "All Orders" tab
        showAddButton={activeTab === "all"}
        getFields={getFields}
        onOrderTypeChange={setOrderType}
        currentOrderType={orderType}
        designs={designs}
        orders={orders}
        onCreate={handleCreateOrder}
      />
    </div>
  );
}

// Wrapper to bridge the custom logic with the generic MasterContainer
// We need to modify MasterContainer slightly or wrap it to handle the dynamic fields state
// Since we can't easily modify MasterContainer to accept a function for fields without breaking others,
// we'll implement a localized version of the logic here or pass props if we modify MasterContainer.
// For now, let's assume we modify MasterContainer to accept `showAddButton` and maybe `customFormLogic`.

// Actually, to avoid changing MasterContainer too much, let's create a specialized container here that reuses the UI components.
import MasterTable from "@/components/master/MasterTable";
import MasterFormLayout from "@/components/master/MasterFormLayout";
import SchemaForm from "@/components/master/SchemaForm";

const MasterContainerWrapper = ({ 
  title, 
  description, 
  columns, 
  showAddButton,
  getFields,
  onOrderTypeChange,
  currentOrderType,
  designs,
  orders = [],
  onCreate
}: any) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formValues, setFormValues] = useState<any>({ orderTypeSelection: "design" });
  
  // Map orders to table data
  const data = orders.map((order: Order) => ({
    orderId: order.orderNumber,
    clientName: order.customer?.name || "Unknown",
    orderType: order.orderType,
    status: order.status,
    deliveryDate: new Date(order.deliveryDate).toLocaleDateString(),
    original: order
  }));

  const handleAdd = () => {
    setFormValues({ orderTypeSelection: "design" });
    onOrderTypeChange("design");
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (onCreate) {
      const success = await onCreate(formValues);
      if (success) {
        setIsFormOpen(false);
      }
    } else {
      setIsFormOpen(false);
    }
  };

  const handleFormChange = (name: string, value: any) => {
    let newValues = { ...formValues, [name]: value };

    if (name === "orderTypeSelection") {
      onOrderTypeChange(value);
    }

    if (name === "designNo" && designs) {
      const selectedDesign = designs.find((d: Design) => d.designNo === value);
      if (selectedDesign) {
        newValues = {
          ...newValues,
          grossWeight: selectedDesign.gwt,
          netWeight: selectedDesign.nwt,
          otherWeight: selectedDesign.owt
        };
      }
    }

    setFormValues(newValues);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
         <p className="text-gray-500 dark:text-gray-400">{description}</p>
         <div className="flex gap-3">
            {showAddButton && (
              <button
                onClick={handleAdd}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
              >
                <span>+</span>
                <span>Add Order</span>
              </button>
            )}
         </div>
      </div>

      <MasterTable
        columns={columns}
        data={data}
        onEdit={() => {}}
        onDelete={() => {}}
        onView={() => {}}
      />

      <MasterFormLayout
        isOpen={isFormOpen}
        title="Add New Order"
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      >
        <SchemaForm
          fields={getFields()}
          values={formValues}
          onChange={handleFormChange}
        />
      </MasterFormLayout>
    </div>
  );
};
