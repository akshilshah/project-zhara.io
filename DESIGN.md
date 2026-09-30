# Zhara Marketing Page — Design System

## Logo (v2 — provided by Akshil, 2026-09-25)

Orange split-stroke Z mark (`#FE6317`) + thin, wide-tracked uppercase "ZHARA" wordmark in
deep navy (`#091A41`). Fixed image asset, not a generated design.

- Source of truth: `assets/logo/zhara-logo-source.png` (original file, do not edit).
- Everything else is derived by `tools/build_logo.py` (Pillow + numpy + potrace). Re-run it
  after replacing the source; do not hand-edit derived files.
- Derived assets in `assets/logo/`:
  - `zhara-logo.svg` / `.png` / `-380|760|1520.png` — full lockup, light backgrounds
  - `zhara-logo-on-dark.*` — orange mark + white wordmark, dark backgrounds (site footer)
  - `zhara-logo-white.*` — all-white lockup; `zhara-logo-mono.*` — all-navy lockup
  - `zhara-mark.svg` / `-256|512|1024.png` — orange mark only; `zhara-mark-white.*`
  - `favicon.svg`, `favicon-16/32/48.png`, `/favicon.ico` — mark on transparent
  - `apple-touch-icon.png`, `android-chrome-192/512.png`, `maskable-512.png` — mark on white
- `assets/og.png` (1200×630) — lockup on white with orange base rule; also generated.

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

## Product visuals (2026-09-28)

- The hero is a square, muted, looping video of the real Zhara widget on the demo store, answering shopper-style queries (`shirts for a goa trip` → `comfy stuff to lounge at home` → `something warm for winter`). Hero queries must read like a shopper talking, never bare keywords like `t sh`.
- It plays only while visible and the tab is active. A pause button is always shown. Reduced motion shows the poster frame. It's captioned as recorded on the live demo store.
- Discovery cards use matching miniature product visuals. Merchant controls use the supplied screenshots. Analytics and overview use captures of the real dashboard renderers with a consistent illustrative dataset. Both use WebP, keyboard-accessible tabs, and expanded views.
- Keep app screenshots and catalog photos local under `assets/demo/`. Source details live in `assets/demo/README.md`. Never include store credentials in site assets.
- On mobile, show each complete screenshot at the card width without offsets or nested scrolling. Expanded screenshots open in a full-screen viewer, fit to width, with an explicit zoom control and a persistent close button.
- Analytics examples show 128,400 searches and related values from one consistent dataset. Use the existing footer note and expanded-view titles to identify the sample data; omit the header badge as requested; do not present sample values as customer outcomes.
