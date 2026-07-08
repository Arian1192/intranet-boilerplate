# Style Guide — Boilerplate Intranet

## Purpose

This document defines the visual language and component conventions for the boilerplate. Future agents should read this before adding new pages or components to keep the UI consistent.

## Colors

### Brand

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-50` | `#F5F3FF` | Hover backgrounds, light accents |
| `brand-100` | `#EDE9FE` | Light badges |
| `brand-600` | `#7C3AED` | Primary buttons, links, active nav |
| `brand-700` | `#6D28D9` | Primary hover |

### Neutrals

Use `slate-*` for text, borders, and backgrounds. Prefer `slate-50` for page background, `slate-100` for borders, `slate-500` for secondary text, `slate-900` for headings.

### Status

| Token | Hex | Meaning |
|-------|-----|---------|
| `status-info` / blue | `#3B82F6` | Info, pending |
| `status-success` / green | `#10B981` | Confirmed, done |
| `status-warning` / yellow | `#F59E0B` | Warning, in progress |
| `status-danger` / red | `#EF4444` | Error, overdue |
| `status-neutral` / slate | `#94A3B8` | Tentative, inactive |

## Typography

- Font: `Inter`, fallback `system-ui`.
- Headings: semibold/bold, tight leading.
- Body: normal weight, relaxed leading.
- Labels: uppercase, bold, wide tracking, small size.

## Spacing

- Page padding: `p-6` to `p-8`.
- Card padding: `p-5` to `p-6`.
- Section gaps: `space-y-8`.
- Card border radius: `rounded-xl`.
- Button radius: `rounded-lg`.

## Components

### Button

Variants: `primary`, `secondary`, `ghost`, `danger`.
Sizes: `sm`, `md`, `lg`.

Primary buttons use `bg-brand-600 text-white hover:bg-brand-700`.

### Card

Always use the `Card` component. It provides `rounded-xl`, `bg-white`, `border-slate-100`, and `shadow-sm`.

### Badge

Map status semantics to badge variants. Do not invent new badge colors.

### Input

Use the `Input` component with `label` and optional `error` props. Never style raw inputs directly.

### Avatar

Use initials fallback. Sizes: `sm`, `md`, `lg`.

## Layout

- Top navigation is sticky with a subtle blur backdrop.
- Main content is centered with `max-w-7xl`.
- Module selector lives in the top nav.

## Do's and Don'ts

- Do use the repository layer for data; never call APIs from components.
- Do use constants from `src/lib/constants.ts` for module names and app config.
- Don't hardcode brand colors; use Tailwind tokens.
- Don't commit real brand names, credentials, or production URLs.
