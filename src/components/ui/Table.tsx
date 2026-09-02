import type { ReactNode } from "react";

export type TableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  empty?: string;
  getRowKey: (row: T) => string;
};

export function Table<T>({ columns, rows, empty = "No rows yet.", getRowKey }: TableProps<T>) {
  if (rows.length === 0) {
    return <p className="text-neutral-500 text-sm">{empty}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-neutral-50 text-midnight">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-border border-t">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-body">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
