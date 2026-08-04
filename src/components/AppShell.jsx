// The app's outermost box. On a phone it's the device screen; on a wide
// display it becomes a left nav rail beside a content column. See
// `.app-shell` in index.css — the nav is a later sibling so the DOM order
// stays screen-then-nav for a screen reader and for the phone layout, and
// `row-reverse` moves it to the left edge on desktop.
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
