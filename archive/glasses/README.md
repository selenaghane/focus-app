# Archived: the glasses feature

Everything here was built around a pair of focus-tracking glasses — a live
focus score from pupil reactivity, the session and trend insights derived from
it, and the paired-device screen. None of it is part of the app any more.

It's kept rather than deleted because the work is real and the hardware might
be. Nothing in `src/` imports any of it, so it has no effect on the build.

## What's in here

| | |
| --- | --- |
| `screens/LiveSession.jsx` | The live focus readout |
| `screens/Insights.jsx`, `SessionSummary.jsx`, `TrendsView.jsx` | Session and over-time insights |
| `screens/GlassesSettings.jsx` | The paired-device screen, including the appearance settings that now live in `src/screens/Settings.jsx` |
| `components/` | The gauges, charts and cards those screens are built from |
| `data/sessionData.js`, `strategiesData.js`, `trendsData.js` | The sample figures they render |
| `services/glasses.js` | The seam that reported whether a pair was connected |
| `utils/chart.js` | Shared chart maths, used only by the charts here |

## Putting it back

The folder mirrors the `src/` layout it came from, so imports *within* this
folder still resolve. Imports reaching back into the app don't —
`GlassesSettings.jsx` in particular expects `SettingRow`, `SegmentedControl`
and `AppearanceSettings`, which stayed in `src/components/`.

Restoring means moving files back to the matching path under `src/`, then
re-adding the tabs to `SCREENS` and `AVAILABLE_TABS` in `src/App.jsx` and the
entries to `TABS` in `src/components/TabBar.jsx`. The git history has the
version where all of that was still wired up, if it's easier to read than to
reconstruct.
