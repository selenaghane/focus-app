// The social/entertainment apps that can be blocked, and which of them are
// blocked by default. Nothing starts blocked — the Insights tab is what's
// supposed to talk someone into turning one on, based on their own usage,
// rather than the app deciding for them before it's seen any data.

export const APP_LIST = [
  { id: 'instagram', name: 'Instagram', color: '#e1306c', letter: 'I', blocked: false },
  { id: 'tiktok', name: 'TikTok', color: '#0f172a', letter: 'T', blocked: false },
  { id: 'snapchat', name: 'Snapchat', color: '#FFC72C', letter: 'S', blocked: false, textDark: true },
  { id: 'youtube', name: 'YouTube', color: '#FF0000', letter: 'Y', blocked: false },
  { id: 'x', name: 'X', color: '#000000', letter: 'X', blocked: false },
  { id: 'discord', name: 'Discord', color: '#5865F2', letter: 'D', blocked: false },
]