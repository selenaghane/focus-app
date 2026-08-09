import { useEffect } from 'react'
import Monster from './Monster'
import MonsterScene from './MonsterScene'
import EnergyMeter from './EnergyMeter'
import ScreenTimeCard from './ScreenTimeCard'
import ScreenTimeSettings from './ScreenTimeSettings'
import { DEFAULT_ENERGY } from '../data/monsterData'

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

export default function MonsterCompanionView({
  config,
  energy = DEFAULT_ENERGY,
  usedMin,
  goalMin,
  onGoalChange,
  unlockMin,
  onUnlockChange,
  usage,
  week,
}) {
  useEffect(() => {
    playChirp()
  }, [])

  return (
    <div className="flex flex-col items-center gap-3">
      <MonsterScene scene={config.scene}>
        <div className="monster-greet">
          <Monster {...config} energy={energy} />
        </div>
      </MonsterScene>
      <span className="text-base font-bold text-slate-900">{config.name}</span>
      <EnergyMeter energy={energy} />
      <ScreenTimeCard usedMin={usedMin} goalMin={goalMin} usage={usage} week={week} />
      <ScreenTimeSettings
        goalMin={goalMin}
        onGoalChange={onGoalChange}
        unlockMin={unlockMin}
        onUnlockChange={onUnlockChange}
      />
    </div>
  )
}
