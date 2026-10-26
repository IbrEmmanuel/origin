# Home services image sources

Central config: `src/data/homeServices.js`

| Service | Asset | Source | Notes |
|---------|-------|--------|-------|
| Solar PV Systems | `src/assets/pdf-assets/solar-2.jpg` | Origin field photography | Crew in PPE installing rooftop panels |
| CCTV & Surveillance | `src/assets/pdf-assets/cctv-pole.jpg` | Origin / in-repo photography | Wall of installed outdoor security cameras |
| BESS & Battery Solutions | `src/assets/pdf-assets/project-ondo.jpg` | Origin project photography | Battery rack + hybrid inverters |
| Access Control Systems | `src/assets/pdf-assets/access-1.jpg` | Licensed / catalog photography in repo | Smart-card door reader |
| Smart Home & Automation | `src/assets/pdf-assets/cctv-main.jpg` | Origin / in-repo photography | Automated gate + remote (gate motors visible) |
| EV Charging Infrastructure | `src/assets/services/ev-charging.jpg` | **Temporary** — Unsplash (`photo-1593941707882-a5bba14938c7`) | Replace with Origin EV charger install photo |

## Removed / avoided (mismatched)

| Old asset usage | Problem |
|-----------------|---------|
| `img-076.jpg` as only CCTV card | Monitoring room is valid surveillance context, but Phase 2 requires clear **camera hardware** — moved to `cctv-pole.jpg` |
| `fire-detector.jpg` / extinguisher stand-in | Weak fire-panel story; Fire card replaced by Smart Automation until company fire-panel photos exist |
| `img-047.jpg` as BESS | Circuit schematics — not battery install |
| `access-biometric.jpg` | Wrong subject (industrial/workshop gear, not biometric terminal) |

## Replacement procedure

1. Drop company photo into `src/assets/services/` or `pdf-assets/`.
2. Update the import in `src/data/homeServices.js`.
3. Remove `temporaryImage: true` when using Origin-owned photography.
4. Rebuild.
