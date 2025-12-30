import React from "react";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";

export interface FieldSchema {
  name: string;
  label: string;
  type: "text" | "select" | "radio" | "textarea" | "file" | "date" | "number" | "password" | "email" | "checkbox";
  options?: { label: string; value: any }[];
  required?: boolean;
  conditional?: (values: any) => boolean;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}

interface SchemaFormProps {
  fields: FieldSchema[];
  values: any;
  onChange: (name: string, value: any) => void;
  errors?: Record<string, string>;
}

const SchemaForm: React.FC<SchemaFormProps> = ({
  fields,
  values,
  onChange,
  errors = {},
}) => {
  return (
    <div className="space-y-5">
      {fields.map((field) => {
        // Handle Conditional Logic
        if (field.conditional && !field.conditional(values)) {
          return null;
        }

        const commonProps = {
          id: field.name,
          name: field.name,
          disabled: field.disabled,
          error: !!errors[field.name],
          hint: errors[field.name] || field.hint,
        };

        return (
          <div key={field.name} className="animate-fadeIn">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-error-500">*</span>}
            </Label>
            
            {field.type === "text" || field.type === "number" || field.type === "email" || field.type === "password" || field.type === "date" || field.type === "file" ? (
              <Input
                {...commonProps}
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(field.name, e.target.value)}
              />
            ) : field.type === "textarea" ? (
              <TextArea
                 {...commonProps}
                 placeholder={field.placeholder}
                 value={values[field.name] || ""}
                 onChange={(value: string) => onChange(field.name, value)}
                 rows={3}
              />
            ) : field.type === "select" ? (
              <Select
                {...commonProps}
                options={field.options || []}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={(value: string) => onChange(field.name, value)}
              />
            ) : field.type === "radio" ? (
               <div className="flex gap-4 mt-2">
                 {field.options?.map((opt) => (
                   <label key={String(opt.value)} className="flex items-center gap-2 cursor-pointer">
                     <input
                       type="radio"
                       name={field.name}
                       value={String(opt.value)}
                       checked={String(values[field.name]) === String(opt.value)}
                       onChange={() => onChange(field.name, opt.value)}
                       className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                     />
                     <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                   </label>
                 ))}
               </div>
            ) : field.type === "checkbox" ? (
                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id={field.name}
                        name={field.name}
                        checked={!!values[field.name]}
                        onChange={(e) => onChange(field.name, e.target.checked)}
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <label htmlFor={field.name} className="text-sm text-gray-700 dark:text-gray-300">
                        {field.placeholder || "Yes"}
                    </label>
                </div>
            ) : (
               // Fallback for other types not fully implemented yet
               <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                 {field.type} input placeholder for {field.label}
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SchemaForm;
