# CLAUDE.md

## Project Overview

OceanEarn adalah platform maritime waste reward system yang menghubungkan nelayan dengan TPS untuk insentif pembersihan laut.

Stack:
- Backend: Django + DRF
- Frontend: React (Vite) + TailwindCSS
- Database: PostgreSQL
- Auth: JWT

Monorepo:
- apps/api → backend
- apps/web → frontend

---

## How to Work in This Repo

Frontend:
- Path: apps/web
- Run: npm install && npm run dev

Backend:
- Path: apps/api
- Run: python manage.py runserver

---

## Frontend Guidelines (IMPORTANT)

### Goal
UI harus mengikuti Figma secara akurat (pixel-accurate pada 1920px).

---

### Layout Rules

- Jangan ubah struktur layout yang sudah ada
- Jangan tambah wrapper baru tanpa alasan jelas
- Jangan ubah positioning global (container, section, dll)
- Gunakan container utama:
  - max-w-[1920px] mx-auto px-[64px]

---

### Styling Rules

- Gunakan Tailwind sebagai default
- Gunakan inline style hanya jika:
  - butuh clamp
  - butuh efek khusus (shadow, glow, dll)

- Gunakan design tokens dari Tailwind config:
  - darkBlue-500 → #033E8C
  - blue-500 → #0460D9
  - lightBlue-500 → #2B88D9
  - orange-500 → #D97925

---

### Typography

- font-title → heading
- font-body → paragraph
- font-ui → navbar / button

---

### Effects

- Glow hanya muncul saat hover
- Idle state harus clean (tanpa glow)
- Hindari shadow yang terlalu besar / kasar

---

### Code Modification Rules

- Hanya ubah bagian yang diminta
- Jangan rewrite entire component
- Jangan ubah file lain tanpa diminta

---

### Assets

Gunakan path:
```js
import logo from '../assets/Logo.svg';