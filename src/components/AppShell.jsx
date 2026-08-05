// The app's outermost box: one phone-width column with the tab bar along the
// bottom, at every width. See `.app-shell` in index.css.
//
// Demo mode swaps this for PhoneFrame/PhoneDevice, which draw a phone around
// the same screens.
export default function AppShell({ nav, children }) {
  return (
    <div className="app-viewport">
      <div className="app-shell">
        <main className="app-content">{children}</main>
        {nav}
      </div>
    </div>
  )
}
