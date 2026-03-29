import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

export default function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, page - 2)
  const end   = Math.min(totalPages, page + 2)

  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center gap-1 justify-end">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        icon={<ChevronLeft size={16} />}
      />
      {start > 1 && (
        <>
          <PageBtn active={false} onClick={() => onChange(1)}>1</PageBtn>
          {start > 2 && <span className="text-slate-600 px-1">…</span>}
        </>
      )}
      {pages.map((p) => (
        <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>
          {p}
        </PageBtn>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-slate-600 px-1">…</span>}
          <PageBtn active={false} onClick={() => onChange(totalPages)}>{totalPages}</PageBtn>
        </>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        icon={<ChevronRight size={16} />}
      />
    </div>
  )
}

function PageBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150
        ${active
          ? 'bg-blue-500/25 text-blue-300 border border-blue-400/40'
          : 'text-slate-400 hover:text-white hover:bg-white/8 border border-transparent'
        }
      `}
    >
      {children}
    </button>
  )
}