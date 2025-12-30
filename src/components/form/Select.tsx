import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  value,
  id,
  name,
  disabled = false,
  error = false,
  hint,
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedValue(val);
    onChange(val); // Trigger parent handler
  };

  let selectClasses = `h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  if (disabled) {
    selectClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    selectClasses += ` border-error-500 focus:ring-error-500/10 dark:border-error-500`;
  }

  // Text color based on selection
  if (selectedValue) {
    selectClasses += " text-gray-800 dark:text-white/90";
  } else {
    selectClasses += " text-gray-400 dark:text-gray-400";
  }

  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        className={selectClasses}
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
      >
        {/* Placeholder option */}
        <option
          value=""
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
        {/* Map over options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}
      </select>
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-error-500" : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Select;
