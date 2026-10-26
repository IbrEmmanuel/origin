# Home services image sources

Central config: `src/data/homeServices.js`

| Service | Asset | Source | Notes |
|---------|-------|--------|-------|
| Solar PV Systems | `src/assets/pdf-assets/solar-2.jpg` | Origin field photography | Crew in PPE installing rooftop panels |
| CCTV & Surveillance | `src/assets/pdf-assets/img-076.jpg` | Origin / project photography | Multi-monitor control room |
| BESS & Battery Solutions | `src/assets/pdf-assets/project-ondo.jpg` | Origin project photography | Battery rack + hybrid inverters |
| Access Control Systems | `src/assets/pdf-assets/access-1.jpg` | Licensed / catalog photography in repo | Smart-card door reader |
| Fire Detection & Suppression | `src/assets/services/fire-safety.jpg` | **Temporary** — [Wikimedia Commons](https://commons.wikimedia.org/wiki/Special:FilePath/Portable_fire_extinguisher.jpg) | Replace with Origin fire-panel / detector install photo |
| EV Charging Infrastructure | `src/assets/services/ev-charging.jpg` | **Temporary** — Unsplash (`photo-1593941707882-a5bba14938c7`) | Replace with Origin EV charger install photo |

## Removed / avoided (mismatched)

| Old asset usage | Problem |
|-----------------|---------|
| `fire-detector.jpg` | Not fire equipment (wrong subject) |
| `img-047.jpg` as BESS | Circuit schematics / blueprints — not battery install |
| `cctv-main.jpg` | Gate remote with graphic overlays — artificial |
| `img-017.jpg` as EV | Dramatic solar-farm sunset stock — not EV charging |

## Replacement procedure

1. Drop company photo into `src/assets/services/` or `pdf-assets/`.
2. Update the import in `src/data/homeServices.js`.
3. Remove `temporaryImage: true` when using Origin-owned photography.
4. Rebuild.
