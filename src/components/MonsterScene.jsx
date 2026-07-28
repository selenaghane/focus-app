const SCENE_STYLES = {
  Room: 'from-amber-50 via-orange-50 to-rose-50',
  Forest: 'from-emerald-50 via-green-50 to-lime-50',
  Space: 'from-indigo-100 via-violet-50 to-slate-50',
  Beach: 'from-sky-100 via-cyan-50 to-amber-50',
}

function SceneDecor({ scene }) {
  if (scene === 'Forest') {
    return (
      <>
        <div className="absolute left-4 bottom-6 w-16 h-16 rounded-full bg-emerald-200/50 blur-sm" />
        <div className="absolute right-6 bottom-10 w-20 h-20 rounded-full bg-green-200/50 blur-sm" />
      </>
    )
  }
  if (scene === 'Space') {
    return (
      <>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 70}%`,
              opacity: 0.6 + (i % 3) * 0.15,
            }}
          />
        ))}
      </>
    )
  }
  if (scene === 'Beach') {
    return (
      <>
        <div className="absolute right-8 top-6 w-14 h-14 rounded-full bg-amber-200/70" />
        <div className="absolute bottom-8 left-0 right-0 h-10 bg-sky-200/40 rounded-t-full" />
      </>
    )
  }
  // Room
  return <div className="absolute right-8 top-8 w-16 h-16 rounded-full bg-amber-200/50 blur-md" />
}

export default function MonsterScene({ scene, children }) {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b ${
        SCENE_STYLES[scene] || SCENE_STYLES.Room
      } flex items-center justify-center py-4`}
      style={{ minHeight: 220 }}
    >
      <SceneDecor scene={scene} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
