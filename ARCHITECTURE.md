# MatterOS Architecture

## Tech Stack
- Next.js 16 (App Router)
- Prisma 6.15
- Supabase PostgreSQL (Session Pooler)
- Turbopack (dev)

## Backend Structure
- API Routes: src/app/api
- Prisma Client: src/lib/prisma.ts
- Schema: prisma/schema.prisma
- Environment: .env (root)

## Data Philosophy
- Deterministic core
- Event-driven ledger
- Policy snapshot versioning
- Auditability > speed

## Core Entities (v1)
- Matter
- PolicySnapshot
- MatterEvent

## Design Direction
MatterOS is evolving toward:
- Institutional-grade reliability
- Case-level risk stabilization
- Deterministic explainability
- Policy Whiplash prevention

---
Last Updated: 2026-02-14
