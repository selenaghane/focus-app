import { useState } from 'react'
import Monster from '../components/Monster'
import MonsterNudge from '../components/MonsterNudge'
import AppIcon from '../components/AppIcon'
import { DEMO_MODE } from '../config'
import { DEFAULT_ENERGY } from '../data/monsterData'
import { hasNativeScreenTime } from '../services/screenTime'

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.4" stroke="#64748b" strokeWidth="1.8" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.4" fill="#64748b" />
    </svg>
  )
}

function CheckCircleIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#1baf7a" strokeWidth="1.8" />
      <path
        d="M8 12.3l2.5 2.5L16 9.3"
        stroke="#1baf7a"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MIN_WORDS = 60

function countWords(text) {
  const trimmed = text.trim()
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length
}

// Writing the justification by hand is the whole gate — pasting sixty words
// in defeats it. Demo mode opts out so a walkthrough can be driven quickly
// without typing an essay on stage.
const blockEvent = DEMO_MODE ? () => {} : (e) => e.preventDefault()

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 5l-7 7 7 7"
        stroke="#64748b"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Reached as a route, this screen needs a way back. The OS version won't
// have one — there you leave by leaving the app — so it only renders when a
// caller actually supplies somewhere to go.
function DoneButton({ onClose }) {
  if (!onClose) return null
  return (
    <button
      type="button"
      onClick={onClose}
      className="mt-2 rounded-full bg-[#2a78d6] text-white text-sm font-semibold px-6 py-2.5 active:bg-[#215fa9]"
    >
      Done
    </button>
  )
}

export default function InstagramBlockScreen({
  monsterConfig,
  monsterEnergy = DEFAULT_ENERGY,
  unlockMin = 5,
  onUnlock,
  onStayFocused,
  onClose,
}) {
  const [stage, setStage] = useState('prompt') // 'prompt' | 'unlocked' | 'dismissed'
  const [text, setText] = useState('')

  const wordCount = countWords(text)
  const enoughWords = wordCount >= MIN_WORDS
  const wordsToGo = MIN_WORDS - wordCount

  const handleUnlock = () => {
    onUnlock?.()
    setStage('unlocked')
  }

  const handleStayFocused = () => {
    onStayFocused?.()
    setStage('dismissed')
  }

  if (stage === 'unlocked') {
    return (
      <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircleIcon size={28} />
        </div>
        <h1 className="text-lg font-bold text-slate-900">
          Unlocked — {unlockMin}:00 remaining
        </h1>
        <p className="text-sm text-slate-500">
          Instagram will pause again automatically when time&rsquo;s up.
        </p>
        <Monster {...monsterConfig} energy={monsterEnergy} size={96} />
        <p className="text-xs text-slate-400">
          {monsterConfig.name} looks a little tired...
        </p>
        <DoneButton onClose={onClose} />
      </div>
    )
  }

  if (stage === 'dismissed') {
    return (
      <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-2xl">
          💪
        </div>
        <h1 className="text-lg font-bold text-slate-900">
          Nice — staying focused 💪
        </h1>
        <p className="text-sm text-slate-500">
          Instagram stays paused for the rest of this block.
        </p>
        <Monster {...monsterConfig} energy={monsterEnergy} size={96} />
        <p className="text-xs text-slate-400">
          {monsterConfig.name} is so proud of you!
        </p>
        <DoneButton onClose={onClose} />
      </div>
    )
  }

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Blurred "app behind" background, simulating Instagram dimmed out */}
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-200 via-rose-200 to-amber-100 blur-2xl scale-110 opacity-60" />
      <div className="absolute inset-0 bg-surface/75 backdrop-blur-xl" />

      <div className="relative flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-3 pb-4 flex flex-col gap-4">
        <div className="relative flex justify-center pt-1">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              data-flat
              className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center"
            >
              <BackIcon />
            </button>
          )}
          <div className="w-12 h-12 rounded-full bg-surface/90 shadow-sm flex items-center justify-center">
            <LockIcon />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="shadow-sm rounded-[13px]">
            <AppIcon id="instagram" size={44} />
          </div>
          <h1 className="text-lg font-bold text-slate-900 mt-0.5">
            Instagram is paused
          </h1>
          <p className="text-xs text-slate-500">Blocked to help you stay focused</p>
        </div>

        {/* Say plainly what this is. A web build can't put itself in front of
            Instagram — that needs the native shell described in the README —
            so without a bridge this screen is reached on purpose, and the
            honest framing is a self-reported unlock rather than an
            interception that already works. Demo mode is showing the finished
            idea to a room, and doesn't need the footnote. */}
        {!DEMO_MODE && !hasNativeScreenTime() && (
          <div className="rounded-2xl bg-amber-50/90 border border-amber-100 px-3.5 py-2.5">
            <span className="text-[calc(11px*var(--ui-text-scale,1))] text-amber-700 leading-snug">
              Blocked apps can&rsquo;t be interrupted automatically yet — that
              needs the native build. Unlocking here still spends{' '}
              {unlockMin} minutes against today&rsquo;s goal.
            </span>
          </div>
        )}

        <MonsterNudge config={monsterConfig} energy={monsterEnergy} />

        <div className="bg-surface/85 rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex flex-col gap-3">
          <p className="text-sm text-slate-600 leading-snug">
            Before you unlock, tell us why. Write at least {MIN_WORDS} words
            about why you need Instagram right now.
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPaste={blockEvent}
            onCopy={blockEvent}
            onCut={blockEvent}
            onDrop={blockEvent}
            onContextMenu={blockEvent}
            rows={5}
            placeholder="Type your reason here — copy & paste is turned off."
            className="w-full resize-none rounded-xl border border-slate-200 bg-surface px-3.5 py-3 text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:border-[#2a78d6] transition-colors"
          />

          <div className="flex items-center gap-1.5 text-[calc(11px*var(--ui-text-scale,1))] font-medium">
            {enoughWords ? (
              <>
                <CheckCircleIcon />
                <span className="text-emerald-600">
                  {wordCount} / {MIN_WORDS} words
                </span>
              </>
            ) : (
              <span className="text-rose-500">
                {wordCount} / {MIN_WORDS} words
                {wordCount > 0 &&
                  ` — ${wordsToGo} more word${wordsToGo === 1 ? '' : 's'} to go.`}
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center gap-2 pb-1">
          <button
            type="button"
            disabled={!enoughWords}
            onClick={handleUnlock}
            className={`w-full rounded-full py-3 text-sm font-semibold shadow-sm transition-colors ${
              enoughWords
                ? 'bg-emerald-500 text-white active:bg-emerald-600'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Unlock for {unlockMin} minutes
          </button>
          <button
            type="button"
            onClick={handleStayFocused}
            className="text-sm font-medium text-slate-400 active:text-slate-500 py-1"
          >
            Never mind, stay focused
          </button>
        </div>
      </div>
    </div>
  )
}
