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

## Current State (Feb 17, 2026)
- Implemented core Matter API:
    Create / list matters.
- Implemented immutable MatterEvent ledger (append-only).
- Implemented controlled Stage Machine with validated transitions.
- Implemented PolicySnapshot creation + transactional attachment.
- Implemented deterministic risk detection endpoint (/at-risk).
- Added initial dashboard summary endpoint for governance visibility. 

## Current State (Feb 18, 2026)

- Added Organization model.
- Implemented tenant isolation via organizationId.
- Secured all core routes with organization scoping.
- Verified cross-organization access is blocked.
- Foundation ready for auth layer. 

## Current State (Feb 19, 2026)
- Connected frontend to real backend /api/matters endpoint.
- Replaced mock matters with live API data.
- Verified filtering works with real data (stage, status, search).
- Confirmed at-risk logic displays correctly from backend risk flags.

## Current State (Feb 20, 2026)
- frontend shell connected to backend; 
- Matter Detail started using backend data; timeline/events endpoint integrated and visible in UI.

## Current State (Feb 24, 2026)
Dev Log – Org Auth & Invite System
-Implemented stateless Supabase JWT auth for API routes
-Added role-based org membership validation
-Created org creation flow with automatic partner assignment
-Built invite generation (token, expiry, maxUses)
-Implemented transactional invite consumption
-Completed end-to-end smoke testing via direct API calls
Auth + multi-tenant invite flow is operational.

## Strategic Vision
MatterOS is designed as:
- A compliance-first legal operations engine
- A deterministic AI decision assistant
- An explainable policy-driven system
- A future “Command Bridge” for legal firms

---
Last Updated: 2026-02-14
