# MatterOS Decisions Log

## 2026-02-14
- Chose Supabase over self-hosted Postgres
- Pinned Prisma to v6.15 (avoiding v7 config changes)
- Adopted Session Pooler (port 5432)
- Chose App Router over Pages Router
- Established event-ledger architecture
- PolicySnapshot model introduced early
- Focus direction: Prevent Policy Whiplash first

## Strategic Principle
MatterOS will:
- Optimize for reliability over speed
- Avoid “AI magic” without determinism
- Prioritize auditability
- Act as institutional infrastructure, not SaaS fluff

---
