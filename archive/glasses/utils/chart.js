// Pupil charts use a FIXED millimetre scale rather than auto-fitting to the
// data, so the engagement threshold sits in the same place on every screen
// and lapses are comparable between the live view and the full session.
// 0.55 mm is about the ceiling for a task-evoked response.
export const Y_MIN = 0
export const Y_MAX = 0.55

export function buildScale({ width, height, padX, padTop, padBottom }) {
  const innerW = width - padX * 2
  const innerH = height - padTop - padBottom

  const yOf = (mm) => padTop + innerH - ((mm - Y_MIN) / (Y_MAX - Y_MIN)) * innerH
  const xOf = (i, count) => padX + (i / (count - 1)) * innerW

  return {
    yOf,
    xOf,
    points: (data) => data.map((mm, i) => ({ x: xOf(i, data.length), y: yOf(mm), mm })),
    line: (pts) =>
      pts
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' '),
    area: (pts) =>
      `${pts
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' ')} L ${pts[pts.length - 1].x.toFixed(1)} ${height - padBottom} L ${pts[0].x.toFixed(1)} ${height - padBottom} Z`,
  }
}
