// Fake automation schedule for the demo — when the glasses should actively
// nudge (per the toggles in the Glasses tab) versus do nothing.

export const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export const SCHEDULE_BLOCKS = [
  {
    id: 'morning-study',
    label: 'Morning study',
    time: '8:00 – 9:30 AM',
    days: [1, 1, 1, 1, 1, 0, 0],
    enabled: true,
  },
  {
    id: 'homework',
    label: 'Homework block',
    time: '4:00 – 5:30 PM',
    days: [1, 1, 1, 1, 1, 0, 0],
    enabled: true,
  },
  {
    id: 'weekend-reading',
    label: 'Weekend reading',
    time: '10:00 – 11:00 AM',
    days: [0, 0, 0, 0, 0, 1, 1],
    enabled: false,
  },
]
