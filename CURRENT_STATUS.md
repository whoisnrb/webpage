# Aktuális Projekt Állapot - 2026. 01. 21.

## Technikai Stack
- **Framework:** Next.js 16.0.8 (App Router)
- **Runtime:** Node.js (Edge runtime az OG képeknél)
- **Auth:** NextAuth.js (v5 beta) - GitHub & Credentials
- **Adatbázis:** Prisma + PostgreSQL (Neon/Vercel)
- **I18n:** next-intl (hu/en támogatás)

## Legutóbbi fontos módosítások
1. **Middleware Migráció:** A `src/middleware.ts` átnevezve `src/proxy.ts`-re a Next.js 16 konvenció szerint.
2. **Discord Integráció:** GitHub Webhook setupolva a Discord értesítésekhez (ingyenes megoldás a Vercel Webhook helyett).
3. **Infrastruktúra Terv:** Az `IT_INFRASTRUCTURE_PLAN.md` elkészült, de az implementáció (hálózati szolgáltatások aloldalai) még folyamatban van.

## Ismert jelenségek
- A Vercel build során az "Edge runtime disables static generation" figyelmeztetés az OG képgenerálás miatt jelenik meg, ez szándékos.
