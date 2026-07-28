import { useState, useEffect } from 'react'
import Monster from './Monster'
import MonsterScene from './MonsterScene'
import { GREETINGS } from '../data/monsterData'

function playChirp() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12)
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.24)
  } catch {
    // Audio isn't available in this environment — the visual greeting
    // still plays, so there's nothing else to do here.
  }
}

export default function MonsterCompanionView({ config, energy = 0 }) {
  const [greeting] = useState(
    () => GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
  )

  useEffect(() => {
    playChirp()
  }, [])

  return (
    <div className="flex flex-col items-center gap-3">
      <MonsterScene scene={config.scene}>
        <div className="flex flex-col items-center gap-2">
          <div className="relative bg-white rounded-2xl shadow-sm px-3.5 py-2 max-w-[220px]">
            <p className="text-sm font-medium text-slate-700 text-center">
              {greeting}
            </p>
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
          </div>
          <div className="monster-greet">
            <Monster {...config} energy={energy} />
          </div>
        </div>
      </MonsterScene>
      <span className="text-base font-bold text-slate-900">{config.name}</span>
    </div>
  )
}
