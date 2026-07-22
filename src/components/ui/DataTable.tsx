interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T extends { id: number }>({
  columns, data, loading, emptyMessage = 'No data found'
}: Props<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        <span className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full spin mr-3" />
        Loading…
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map(col => (
              <th key={String(col.key)} className={`text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} className="py-12 text-center text-gray-400">{emptyMessage}</td></tr>
          ) : data.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {columns.map(col => (
                <td key={String(col.key)} className={`py-3 px-4 text-gray-700 ${col.className ?? ''}`}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
