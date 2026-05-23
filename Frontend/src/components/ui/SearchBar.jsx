import { Search, X } from 'lucide-react'

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className   = '',
  onClear,
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-9 py-2.5 rounded-lg text-sm
          bg-white border border-[#d9d4c8] hover:border-[#8ca9a4]
          text-[#182321] placeholder:text-[#9aa39f] shadow-sm
          focus:outline-none focus:ring-2 focus:ring-[#004643]/10 focus:border-[#004643]
          transition-colors duration-200
        "
      />
      {value && (
        <button
          onClick={() => { onChange(''); onClear?.() }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#697773] hover:text-[#004643] transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
