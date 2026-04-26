# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OceanEarn** is a maritime waste reward system connecting waste collectors (nelayan/fishers) with waste collection points (TPS) to incentivize ocean cleanup. The platform uses AI-powered waste estimation and GPS-based TPS matching.

**Stack**: Django 5.1 + DRF (backend) · React 19 + Vite (frontend) · PostgreSQL · JWT + Google SSO

---

## Commands

### Backend (`apps/api/`)
```bash
# Install dependencies
pip install -r requirements.txt

# Database setup
python manage.py migrate
python manage.py createsuperuser

# Run dev server (http://localhost:8000)
python manage.py runserver

# Run tests
python manage.py test

# Run tests for a specific app
python manage.py test features.submissions
```

### Frontend (`apps/web/`)
```bash
npm install
npm run dev      # http://localhost:5173 (proxies /api → localhost:8000)
npm run build
npm run lint
npm run preview
```

---

## Architecture

### Monorepo Layout
```
apps/
  api/                    # Django backend
    oceanearn_core/       # Settings, root URLs, WSGI/ASGI
    features/
      users/              # Auth, roles, TPS profiles, verification docs
      submissions/        # Waste photo submission pipeline
      rewards/            # Coin catalog, redemption, transaction ledger
  web/                    # React frontend
    src/
      utils/api.js        # Axios instance with JWT interceptor
      pages/              # Page-level components (scaffolded)
      components/         # Reusable UI components (scaffolded)
      hooks/              # Custom hooks (scaffolded)
      context/            # Global state (scaffolded)
```

### Backend Patterns

**Service layer** — business logic lives in `services.py` per feature app, not in views. Views are thin HTTP handlers.

**Role-based access** — `User.role` choices: `UMUM`, `NELAYAN`, `TPS`, `ADMIN`. Permission classes (`IsNelayan`, `IsTPS`, `IsAdminMitra`) are defined per app and applied on views via `permission_classes`.

**JWT auth** — stateless, no sessions. Access tokens (24h) + refresh tokens (7d). The custom `CustomTokenObtainPairSerializer` embeds `role` in the token response.

**Two-phase submission** — `/analyze/` does AI estimation without persisting to DB; `/confirm/` saves the final submission. This lets the user review estimates before committing.

**Anti-fraud** — perceptual hashing (pHash via `imagehash`) on submitted photos. Hamming distance ≤ 10 rejects duplicates within the same user's history.

**Mock YOLO** — `features/submissions/services.py::predict_waste_with_yolo()` returns hardcoded estimates. The TODO comment marks where the real `ultralytics` model should be integrated.

**Coin economy** — `KOIN_RATES` (plastik: 100, logam: 120, kaca: 60, organik: 40 koin/kg) and `CARBON_FACTORS` are constants in `submissions/services.py`. `validate_and_credit()` atomically updates the submission, increments `User.poin_terkumpul`, and writes a `TransactionLedger` entry. `process_redemption()` in `rewards/services.py` does the reverse atomically.

### Frontend Patterns

**Axios instance** (`src/utils/api.js`) — `baseURL: /api/v1`, request interceptor injects `Authorization: Bearer <token>` from `localStorage["access_token"]`, response interceptor redirects to `/login` on 401.

**Form stack** — `react-hook-form` + `zod` + `@hookform/resolvers`.

**Tailwind theme** — custom `ocean` (blues) and `coral` (reds/pinks) color palettes defined in `tailwind.config.js`.

**Vite proxy** — all `/api` requests in dev are forwarded to `http://localhost:8000`.

---

## Key Models & Relationships

```
User (custom AbstractUser)
  ├── role: UMUM | NELAYAN | TPS | ADMIN
  ├── poin_terkumpul: int   # coin balance
  ├── is_verified: bool
  └── TPSProfile (1:1, TPS role only)
       └── harga_per_kg: JSON  # {plastik: 2000, logam: 1500, ...} Rp/kg
  └── VerificationDocument (M2O)
       └── status: PENDING | APPROVED | REJECTED

WasteSubmission
  ├── user → User (NELAYAN)
  ├── tps → TPSProfile
  ├── foto_sampah: ImageField
  ├── perceptual_hash: str  # pHash for duplicate detection
  ├── ai_estimation: JSON   # from mock YOLO
  ├── final_weight: JSON    # set by TPS after weighing
  └── status: PENDING | VALIDATED | REJECTED

TransactionLedger          # append-only coin audit trail
  ├── user → User
  ├── amount: int           # positive=earn, negative=redeem
  ├── transaction_type: earn | redeem
  ├── ref_submission_id     # optional FK for earn entries
  └── ref_redemption_id     # optional FK for redeem entries

RewardCatalog
  └── stok: int             # 0 = unlimited

RedemptionOrder
  ├── user → User, reward → RewardCatalog
  ├── koin_spent: int       # snapshot of price at time of redemption
  └── status: PENDING | SUCCESS | FAILED
```

---

## API Route Map

| Prefix | App |
|--------|-----|
| `/api/v1/users/` | Auth, profiles, verification |
| `/api/v1/submissions/` | Waste submission pipeline |
| `/api/v1/rewards/` | Coin catalog, redemption, ledger |
| `/accounts/` | django-allauth (social auth) |

### Notable endpoints
- `POST /api/v1/users/register/` — registration
- `POST /api/v1/users/login/` — JWT token pair + role
- `POST /api/v1/users/role-setup/` — OAuth users pick role
- `GET|PUT /api/v1/users/tps/profile/` — TPS profile CRUD
- `POST /api/v1/users/verification/upload/` — KYC doc upload
- `GET /api/v1/users/admin/verifications/` — admin queue
- `POST /api/v1/users/admin/verifications/<id>/review/` — approve/reject
- `POST /api/v1/submissions/analyze/` — photo analysis (no DB write)
- `POST /api/v1/submissions/confirm/` — persist submission
- `GET /api/v1/submissions/history/` — nelayan's history
- `PATCH /api/v1/submissions/<id>/validate/` — TPS weighs and validates; atomically credits coins
- `GET /api/v1/rewards/` — reward catalog (all authenticated users)
- `POST /api/v1/rewards/redeem/` — spend coins on a reward (NELAYAN only)
- `GET /api/v1/rewards/redemptions/` — nelayan's redemption history
- `GET /api/v1/rewards/transactions/` — coin ledger (earn + redeem)
- `POST /api/v1/rewards/admin/catalog/` — admin creates new reward

---

## Environment

Backend reads from `apps/api/.env` (copy from `apps/api/.env.example`). Required vars:
- `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (set to dummy values locally)

---

## Adding a New Feature

**Backend app**:
1. Create `apps/api/features/<name>/` with `models.py`, `serializers.py`, `views.py`, `services.py`, `urls.py`.
2. Add to `INSTALLED_APPS` in `oceanearn_core/settings.py`.
3. Include in `oceanearn_core/urls.py`.
4. Run `python manage.py makemigrations <name> && python manage.py migrate`.

**Frontend page**:
1. Create `src/pages/MyPage.jsx`.
2. Add `<Route>` in `App.jsx`.
3. Use `import api from '@/utils/api'` for all API calls.
