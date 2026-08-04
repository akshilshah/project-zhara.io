# Zhara Marketing Page — Design System

## Logo (FINAL — provided by Akshil, 2026-08-04)

The final logo is a **fixed image asset**, not a generated design: an orange monoline Z-loop
mark + thin, wide-tracked uppercase "ZHARA" wordmark in deep navy.

- Source of truth: `assets/logo/zhara-logo-source.png` (original file, do not edit).
- Derived assets (regenerate from source with ImageMagick if needed):
  - `zhara-logo-full.png` / `zhara-logo-full-760.png` — transparent lockup (light backgrounds)
  - `zhara-logo-full-white.png` / `-760` — wordmark recolored white (dark backgrounds)
  - `zhara-mark.png` — orange mark only (CTA, watermarks)
  - `favicon-16/32/48.png` — mark on transparent
  - `android-chrome-192/512.png`, `apple-touch-icon.png` — mark on navy `#141A3C` rounded tile
- All previous generated logo experiments were deleted (2026-08-04). Pre-rebrand v1 backup
  remains in `assets/logo/_old-v1/`.

## Palette (premium editorial refresh, 2026-08-04)

| Token | Value | Use |
|---|---|---|
| `--ink` | `#11152D` | Headlines, body ink, primary buttons, dark section bg |
| `--ink-2` | `#34394F` | High-contrast body copy |
| `--muted` | `#686C7E` | Supporting copy |
| `--paper` | `#FFFFFF` | Primary clean canvas |
| `--paper-2` | `#F7F7F5` | Secondary neutral surfaces |
| `--white` | `#FFFFFF` | Cards and sections |
| `--line` | `rgba(17,21,45,.13)` | Quiet structural borders |
| `--orange` | `#F45D18` | Brand accent, CTA, semantic highlight |
| `--orange-pale` | `#FFE5D6` | Accent tint chips and halos |
| `--green` | `#1C8A58` | Success only |

## Typography

- **Primary family: Manrope** (400–700, Google Fonts) for highly legible UI and body copy.
- **Editorial accent: Newsreader Italic** (500) for one emphasized word in major headlines.
- Headlines: 600 weight, tight tracking, compact line-height, generous surrounding space.
- Primary content is inset from the 1200px structural rules; text must never begin directly on a rule.
- Structural vertical rules are desktop-only and are removed on mobile layouts.
- Body: 400–500 with a 1.65–1.72 line-height and a practical 640px reading measure.
- Small labels stay at 12–13px; avoid excessive tracking and low-contrast uppercase text.
- Never render "ZHARA" as decorative background text; use the logo image only in brand contexts.

## Components

- Buttons: 13px radius, readable 14–15px labels; navy fill shifts to orange on hover.
- Product panels: compact 13–18px radius, quiet borders, and restrained depth.
- Hero: editorial split layout with strong product proof and animated intent-aware results.
- Trust: product truths, transparent illustrative-data labels, and no invented social proof.
- Section rhythm: white structural canvas with aligned vertical rules → navy analytics → white CTA.
- Merchandising is summarized in three simple capabilities separated by structural rules.
- Numbering is reserved for genuinely sequential setup steps; section labels and feature summaries remain unnumbered.
- Sequential setup cards stack vertically on mobile to preserve readable line lengths.
- Reveal-on-scroll uses a soft 18px rise and respects `prefers-reduced-motion`.

## Rules

- Product truths only — no fabricated customer counts or testimonials.
- Orange is an accent for actions, status, and small highlights; large page surfaces stay white or navy.
- Prices in ₹ (fashion demo catalog).
- Any sample dashboard metrics must be clearly labeled illustrative.
