import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { PencilIcon, TrashBinIcon, EyeIcon } from "@/icons";

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface MasterTableProps {
  columns: Column[];
  data: any[];
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
  onView: (row: any) => void;
  showActions?: boolean;
}

const MasterTable: React.FC<MasterTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  showActions = true,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto max-h-[70vh] overflow-y-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  isHeader
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 whitespace-nowrap"
                >
                  {col.header}
                </TableCell>
              ))}
              {showActions && (
                <TableCell
                  isHeader
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  // @ts-ignore
                  colSpan={columns.length + (showActions ? 1 : 0)}
                >
                  <div className="flex items-center justify-center w-full">
                    No data available
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onView(row)}
                          className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onEdit(row)}
                          className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(row)}
                          className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
                        >
                          <TrashBinIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MasterTable;
