// The app's outermost box — the device viewport itself. See `.app-viewport`
// in index.css for what it has to get right: dynamic viewport height and the
// safe-area insets.
//
// Demo mode swaps this for PhoneFrame/PhoneDevice, which draw a phone around
// the same screens.
export default function AppShell({ children }) {
  return (
    <div className="app-viewport">
      <div className="app-surface">{children}</div>
    </div>
  )
}
