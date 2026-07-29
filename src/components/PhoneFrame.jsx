export default function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-wrap items-center justify-center gap-12 bg-white p-8">
      {children}
    </div>
  )
}
