import { useId } from 'react'

// Recognisable stand-ins for each app's real icon, drawn as inline SVG so
// there are no image assets to ship or license. Keyed by the ids in
// blockingData.

function Instagram({ uid }) {
  return (
    <>
      <defs>
        <radialGradient id={uid} cx="0.3" cy="1" r="1.1">
          <stop offset="0%" stopColor="#fdd75f" />
          <stop offset="28%" stopColor="#f7913c" />
          <stop offset="55%" stopColor="#e6376f" />
          <stop offset="80%" stopColor="#c32aa3" />
          <stop offset="100%" stopColor="#7638fa" />
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#${uid})`} />
      <rect
        x="12"
        y="12"
        width="24"
        height="24"
        rx="7.5"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
      />
      <circle cx="24" cy="24" r="6" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="32.6" cy="15.4" r="2.1" fill="#fff" />
    </>
  )
}

function TikTok() {
  // The note glyph, with the signature cyan/pink offset behind it.
  const note =
    'M31.5 10h-5.2v21.1a4.6 4.6 0 1 1-4.6-4.6c.5 0 .9.1 1.3.2v-5.3a10 10 0 0 0-1.3-.1 9.9 9.9 0 1 0 9.9 9.9V20.6a11.7 11.7 0 0 0 6.9 2.2v-5.2a6.7 6.7 0 0 1-6.9-6.4V10Z'
  return (
    <>
      <rect width="48" height="48" rx="14" fill="#010101" />
      <path d={note} fill="#69C9D0" transform="translate(-1.6 1.4)" />
      <path d={note} fill="#EE1D52" transform="translate(1.6 -1.4)" />
      <path d={note} fill="#fff" />
    </>
  )
}

function Snapchat() {
  return (
    <>
      <rect width="48" height="48" rx="14" fill="#FFFC00" />
      <path
        d="M24 10c4.6 0 7.4 3.3 7.4 7.6 0 1.3-.1 2.4-.2 3.3.6.2 1.3-.2 2-.4.9-.2 1.8.5 1.6 1.4-.2.9-1.6 1.4-2.6 1.9-.6.3-1 .5-1 1 0 .9 2.6 4.6 6 5.6.6.2.8.8.5 1.3-.5.9-2.5 1.4-3.8 1.6-.3.5-.2 1.7-.9 1.9-.7.2-2-.3-3.4-.1-1.3.2-2.4 1.9-5.6 1.9s-4.3-1.7-5.6-1.9c-1.4-.2-2.7.3-3.4.1-.7-.2-.6-1.4-.9-1.9-1.3-.2-3.3-.7-3.8-1.6-.3-.5-.1-1.1.5-1.3 3.4-1 6-4.7 6-5.6 0-.5-.4-.7-1-1-1-.5-2.4-1-2.6-1.9-.2-.9.7-1.6 1.6-1.4.7.2 1.4.6 2 .4-.1-.9-.2-2-.2-3.3C16.6 13.3 19.4 10 24 10Z"
        fill="#fff"
      />
    </>
  )
}

function YouTube() {
  return (
    <>
      <rect width="48" height="48" rx="14" fill="#fff" />
      <rect x="4" y="12" width="40" height="24" rx="7.5" fill="#FF0000" />
      <path d="M20.5 18.5 30 24l-9.5 5.5v-11Z" fill="#fff" />
    </>
  )
}

function XApp() {
  return (
    <>
      <rect width="48" height="48" rx="14" fill="#000" />
      <path
        d="M28.7 12h3.9l-8.5 9.7L34 36h-7.8l-6.1-8-7 8h-3.9l9.1-10.4L14 12h8l5.5 7.3L28.7 12Zm-1.4 21.7h2.2L20.8 14.2h-2.3l8.8 19.5Z"
        fill="#fff"
      />
    </>
  )
}

function Discord() {
  return (
    <>
      <rect width="48" height="48" rx="14" fill="#5865F2" />
      <path
        d="M32.9 16.8a20 20 0 0 0-5-1.5l-.3.6a18.6 18.6 0 0 1 4.5 1.5c-5.3-2.4-11.5-2.4-16.9 0a18.6 18.6 0 0 1 4.5-1.5l-.3-.6a20 20 0 0 0-5 1.5C11 21.6 10.1 26.3 10.5 31a20.3 20.3 0 0 0 6.2 3.1l1.3-2.1a13 13 0 0 1-2-1l.5-.4a14.4 14.4 0 0 0 12.4 0l.5.4c-.6.4-1.3.7-2 1l1.3 2.1a20.2 20.2 0 0 0 6.2-3.1c.5-5.5-.9-10.1-3.9-14.2ZM19.6 28.3c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5 2.2 1.1 2.2 2.5-1 2.5-2.2 2.5Zm8.8 0c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5 2.2 1.1 2.2 2.5-1 2.5-2.2 2.5Z"
        fill="#fff"
      />
    </>
  )
}

const ICONS = {
  instagram: Instagram,
  tiktok: TikTok,
  snapchat: Snapchat,
  youtube: YouTube,
  x: XApp,
  discord: Discord,
}

export default function AppIcon({ id, size = 36 }) {
  const uid = useId().replace(/:/g, '')
  const Glyph = ICONS[id]
  if (!Glyph) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className="shrink-0"
      aria-hidden="true"
    >
      <Glyph uid={uid} />
    </svg>
  )
}
