# OceanEarn

**Maritime waste collection and reward platform prototype built for I/O Festival 2026.**

OceanEarn was designed to connect fishermen and local waste collection points (TPS) through a digital waste-submission workflow. The platform combines role-based access control, image-based waste estimation, nearby TPS discovery, duplicate-image detection, physical validation, and a coin-based reward system.

> **Project status:** Discontinued prototype. The repository contains a partially implemented frontend and a more complete backend proof of concept. Some planned features, most notably the production YOLO inference pipeline, were not completed.

## Overview

The proposed OceanEarn flow was:

1. A fisherman uploads a photo of collected waste.
2. The backend checks the image against previous submissions using perceptual hashing.
3. The system returns a preliminary waste estimate and nearby active TPS locations.
4. The fisherman selects a TPS and confirms the submission.
5. The TPS physically validates the waste type and weight.
6. OceanEarn credits coins to the fisherman and records the transaction.
7. Coins can be exchanged for rewards from the platform catalog.

The project uses separate React and Django applications inside a small monorepo structure.

## Implemented Features

### Authentication and roles

- Custom Django user model with four roles:
  - General user
  - Fisherman (`nelayan`)
  - TPS operator
  - Admin
- JWT-based authentication using Django REST Framework Simple JWT.
- Role-based API permissions for fishermen, TPS operators, and admins.
- Registration, login, profile, and role-selection endpoints.
- Account verification workflow for fishermen and TPS operators through uploaded documents and admin review.
- Google OAuth/allauth scaffolding for social authentication.

### Waste submissions

- Image upload and submission workflow.
- Perceptual hashing (`pHash`) for duplicate-image detection.
- Hamming-distance comparison against a user's previous submissions.
- Configurable duplicate threshold to tolerate resized or recompressed versions of the same image.
- Nearby TPS discovery using the Haversine distance formula.
- Submission history and validation states.
- Physical validation by the selected TPS before rewards are credited.

### Waste estimation

The backend defines a YOLO-compatible inference interface for estimating:

- dominant waste category,
- estimated waste breakdown,
- confidence score,
- estimated coin range, and
- estimated carbon impact.

The current repository uses **mock inference data** as a placeholder. A real Ultralytics YOLO model was planned but was not integrated before development stopped.

### Rewards and transactions

- Coin calculation from validated waste type and weight.
- Atomic balance updates during TPS validation.
- Transaction ledger for earned and redeemed coins.
- Reward catalog.
- Reward redemption with balance and stock validation.
- Redemption history.

### Frontend

The React frontend currently includes:

- responsive landing page,
- sign-in page,
- registration page,
- authentication context,
- JWT storage and refresh handling,
- Google sign-in UI,
- reusable landing-page components and animations.

Dashboard and end-to-end user workflows were not completed in the frontend.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Framer Motion
- React Hook Form
- Zod
- Recharts

### Backend

- Python
- Django 5
- Django REST Framework
- PostgreSQL
- Simple JWT
- django-allauth
- dj-rest-auth
- Pillow
- ImageHash / perceptual hashing

### Planned AI component

- Ultralytics YOLO for image-based waste detection and estimation

## Architecture

```text
React / Vite Client
        |
        | HTTP + JWT
        v
Django REST API
        |
        +-- Users & Verification
        |     +-- Role-based authorization
        |     +-- Verification documents
        |
        +-- Waste Submissions
        |     +-- pHash duplicate detection
        |     +-- Waste estimation interface
        |     +-- Nearby TPS calculation
        |     +-- TPS physical validation
        |
        +-- Rewards
        |     +-- Coin balance
        |     +-- Transaction ledger
        |     +-- Reward redemption
        |
        v
PostgreSQL
```

## Repository Structure

```text
oceanearn/
├── apps/
│   ├── api/
│   │   ├── features/
│   │   │   ├── users/
│   │   │   ├── submissions/
│   │   │   └── rewards/
│   │   ├── oceanearn_core/
│   │   ├── manage.py
│   │   └── requirements.txt
│   │
│   └── web/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── hooks/
│       │   ├── pages/
│       │   └── utils/
│       └── package.json
│
├── .env.example
└── package.json
```

## API Overview

The backend exposes REST endpoints under `/api/v1/`.

| Area | Examples |
| --- | --- |
| Authentication | `users/register/`, `users/login/`, `users/token/refresh/`, `users/me/` |
| Roles & verification | `users/role-setup/`, `users/verification/upload/`, `users/admin/verifications/` |
| TPS | `users/tps/profile/`, `users/tps/public/` |
| Waste submissions | `submissions/analyze/`, `submissions/confirm/`, `submissions/history/` |
| TPS validation | `submissions/<id>/validate/` |
| Public statistics | `submissions/stats/` |
| Rewards | `rewards/`, `rewards/redeem/`, `rewards/redemptions/`, `rewards/transactions/` |

## Local Development

This repository is archived in an unfinished state, so setup may require minor dependency or configuration fixes.

### 1. Clone the repository

```bash
git clone https://github.com/veinsan/oceanearn.git
cd oceanearn
```

### 2. Configure PostgreSQL

Create a local database named `oceanearn_db`, then copy the environment template:

```bash
cp .env.example .env
```

Configure at least:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173

DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

Google OAuth additionally requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### 3. Run the backend

```bash
cd apps/api
python -m venv .venv
```

Activate the environment, then install the backend dependencies:

```bash
pip install -r requirements.txt
pip install ImageHash
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/v1/`.

> `ImageHash` is imported by the submission service but is not pinned in the current `requirements.txt`.

### 4. Run the frontend

In another terminal:

```bash
cd apps/web
npm install
npm run dev
```

The frontend defaults to `http://localhost:5173` and expects the API at `http://localhost:8000/api/v1`.

To use another backend URL, configure:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Known Limitations

- YOLO inference is mocked and no trained model weights are included.
- The frontend only implements the public landing and authentication screens.
- Fisherman, TPS, reward, verification, and admin dashboards were not completed.
- Google OAuth contains backend/frontend scaffolding but may require additional endpoint and provider configuration to work end to end.
- Automated tests were not implemented beyond the initial Django test scaffolding.
- The backend dependency list is missing the `ImageHash` package currently used by the submission service.
- The project was not completed or prepared for production deployment.

## Development Status

OceanEarn is preserved as an **unfinished competition prototype** and portfolio artifact. Development was stopped before the complete end-to-end product and production AI pipeline were finished.

The repository is useful primarily as a reference for the system design and backend implementation explored during the project, particularly role-based APIs, verification workflows, anti-duplicate image checks, geospatial TPS selection, and transactional reward handling.
