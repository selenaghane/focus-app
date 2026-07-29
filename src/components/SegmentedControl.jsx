export default function SegmentedControl({ options, value, onChange, disabled = false }) {
  return (
    <div className={`flex w-full bg-slate-100 rounded-xl p-1 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 min-w-0 whitespace-nowrap text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${
            value === opt ? 'bg-white text-[#2a78d6] shadow-sm' : 'text-slate-400'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
