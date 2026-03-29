import Spinner from './Spinner'
import EmptyState from './EmptyState'

export default function Table({
  columns   = [],
  data      = [],
  loading   = false,
  emptyMessage = 'No records found.',
  className  = '',
}) {
  return (
    <div className={`glass-card overflow-hidden p-0 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`
                    px-4 py-3.5 text-left
                    text-xs font-semibold text-slate-400 uppercase tracking-wider
                    whitespace-nowrap
                    ${col.className ?? ''}
                  `}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex justify-center py-16">
                    <Spinner size="lg" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors duration-150"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-4 py-3.5 text-slate-300 whitespace-nowrap ${col.cellClassName ?? ''}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}