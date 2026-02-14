# MatterOS — Project Memory

## Project Overview
MatterOS is a legal orchestration engine built with:
- Next.js 16 (App Router)
- Prisma 6.15.0
- Supabase PostgreSQL (Session Pooler, port 5432)
- Turbopack dev environment

## Database Strategy
- Supabase primary database
- Connection via Session Pooler
- Prisma migrate used for schema control
- Prisma pinned to v6.15 (v7 avoided due to config breaking changes)

## Core Models
- Matter
- PolicySnapshot
- Event (ledger-based event tracking)

## Architectural Principles
- Deterministic audit trail
- Immutable event ledger
- Policy snapshot per decision
- Risk sensitivity scoring
- Legal explainability over black-box AI

## Folder Structure
- src/app (Next App Router)
- src/app/api (API routes)
- src/lib (Prisma client, utilities)
- prisma/schema.prisma
- .env at project root

## Current State (Feb 14, 2026)
- Prisma configured
- Migrations applied
- Dev server running clean
- API route for matters being implemented

## Strategic Vision
MatterOS is designed as:
- A compliance-first legal operations engine
- A deterministic AI decision assistant
- An explainable policy-driven system
- A future “Command Bridge” for legal firms

---
Last Updated: 2026-02-14
