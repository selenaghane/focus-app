import StatusBar from './StatusBar'

export default function PhoneDevice({ children }) {
  return (
    <div className="phone-device relative shrink-0 w-[390px] h-[844px] rounded-[55px] bg-slate-900 p-3 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.45)]">
      {/* Side buttons */}
      <div className="absolute -left-[2px] top-[120px] w-[3px] h-8 rounded-l-sm bg-slate-800" />
      <div className="absolute -left-[2px] top-[165px] w-[3px] h-14 rounded-l-sm bg-slate-800" />
      <div className="absolute -left-[2px] top-[230px] w-[3px] h-14 rounded-l-sm bg-slate-800" />
      <div className="absolute -right-[2px] top-[180px] w-[3px] h-20 rounded-r-sm bg-slate-800" />

      {/* Screen */}
      <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-gradient-to-b from-sky-50 via-white to-emerald-50 flex flex-col">
        <StatusBar />

        <div className="flex-1 min-h-0 flex flex-col">{children}</div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] rounded-full bg-slate-900/25 z-20" />
      </div>
    </div>
  )
}
