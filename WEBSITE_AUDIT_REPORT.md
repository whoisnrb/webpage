# Weboldal Audit és Javítási Terv

## 📊 ÁRAZÁSI MÓDOSÍTÁSOK (PRIORITÁS: MAGAS)

### Webfejlesztés (`/szolgaltatasok/webfejlesztes`)
**Jelenlegi árak:**
- Bemutatkozó: 150,000 Ft-tól
- Webáruház: 350,000 Ft-tól  
- Egyedi: 600,000 Ft+

**Javasolt reális árak (2026, magyar piac):**
- **Bemutatkozó/Landing Page**: 200,000 - 300,000 Ft (1-5 aloldal, reszponzív, SEO alap)
- **Webáruház (E-commerce)**: 500,000 - 800,000 Ft (WooCommerce/Shopify, fizetés, készletkezelés)
- **Egyedi/SaaS Platform**: 1,200,000 - 2,500,000 Ft+ (Headless CMS, komplex funkciók, API-k)

### Scriptek & Automatizáció (`/szolgaltatasok/scriptek`)
**Jelenlegi árak:**
- Egyszerű: 50,000 Ft-tól
- Közepes: 150,000 Ft-tól
- Komplex: 300,000 Ft+

**Javasolt reális árak:**
- **Egyszerű** (1-2 integráció): 80,000 - 120,000 Ft
- **Közepes** (3-5 integráció, komplex logika): 200,000 - 350,000 Ft
- **Komplex** (6+ integráció, AI/ML, microservices): 500,000 - 1,000,000 Ft+

### Rendszerüzemeltetés & DevOps (`/szolgaltatasok/rendszeruzemeltetes`)
**Jelenlegi árak (havi):**
- Alap: 40,000 Ft/hó-tól
- Pro: 100,000 Ft/hó-tól
- Enterprise: Egyedi

**Javasolt reális árak (havi előfizetés):**
- **Alap** (kisebb oldalak): 60,000 - 80,000 Ft/hó
- **Pro** (üzleti kritikus): 150,000 - 200,000 Ft/hó
- **Enterprise** (nagy forgalom, dedikált mérnök): 300,000 - 500,000 Ft/hó+

### Biztonság & Audit (`/szolgaltatasok/biztonsag`)
**Jelenlegi árak (egyszeri):**
- Alap Audit: 80,000 Ft-tól
- Részletes Audit: 150,000 Ft-tól
- Komplex Védelem: Egyedi

**Javasolt reális árak:**
- **Alap Audit** (automatizált scan): 100,000 - 150,000 Ft
- **Részletes Audit** (manuális pentest): 250,000 - 400,000 Ft
- **Komplex Védelem** (teljes pentest, WAF, oktatás): 600,000 - 1,200,000 Ft

---

## 🎨 UI/UX PROBLÉMÁK ÉS JAVÍTÁSOK

### 1. **Konzisztencia Problémák**

#### A. Gombok és CTA-k
- ❌ **Probléma**: Különböző gomb stílusok az oldalon (néhol `bg-primary`, néhol `bg-white/[0.05]`)
- ✅ **Javítás**: Egységes gomb komponens rendszer kialakítása
  - Primary CTA: `bg-primary hover:bg-primary/90` + shadow
  - Secondary CTA: `bg-white/[0.05] hover:bg-white/[0.1]` + border
  - Tertiary: csak border, átlátszó háttér

#### B. Kártyák (Cards)
- ❌ **Probléma**: Eltérő padding, border-radius értékek
- ✅ **Javítás**: 
  - Standard padding: `p-8` vagy `p-10`
  - Standard border-radius: `rounded-[40px]` vagy `rounded-[48px]`
  - Egységes `SpotlightCard` használata

#### C. Tipográfia
- ❌ **Probléma**: Inkonzisztens font-weight használat (néhol `font-black`, néhol `font-bold`)
- ✅ **Javítás**:
  - H1/Hero címek: `font-black text-6xl md:text-7xl`
  - H2/Section címek: `font-black text-4xl md:text-6xl`
  - H3/Card címek: `font-black text-2xl md:text-3xl`
  - Body text: `font-medium`

### 2. **Spacing és Layout Problémák**

#### A. Section Padding
- ❌ **Probléma**: Néhány section `py-24`, mások `py-32`, nincs egységes ritmus
- ✅ **Javítás**: Egységes spacing rendszer
  - Mobile: `py-16`
  - Desktop: `py-24 md:py-32`
  - Hero sections: `py-32 md:py-40`

#### B. Container Widths
- ❌ **Probléma**: Néhol `max-w-6xl`, néhol `max-w-7xl`, néhol nincs max-width
- ✅ **Javítás**:
  - Standard content: `max-w-7xl mx-auto`
  - Narrow content (text): `max-w-4xl mx-auto`
  - Wide content (grids): `max-w-[1600px] mx-auto`

### 3. **Színek és Kontrasztok**

#### A. Text Readability
- ❌ **Probléma**: Néhány helyen `text-white/40` túl halvány, nehezen olvasható
- ✅ **Javítás**:
  - Primary text: `text-white`
  - Secondary text: `text-white/70` (nem 40%)
  - Muted text: `text-white/50`
  - Disabled: `text-white/30`

#### B. Háttér Átlátszóság
- ❌ **Probléma**: Néhány kártya `bg-white/[0.02]` túl átlátszó, alig látszik
- ✅ **Javítás**:
  - Standard card: `bg-white/[0.03]` vagy `bg-white/[0.05]`
  - Hover state: `hover:bg-white/[0.08]`
  - Active/Selected: `bg-white/[0.1]`

### 4. **Animációk és Transitions**

#### A. Túl Gyors Animációk
- ❌ **Probléma**: Néhány `transition-all duration-300` túl gyors, nem smooth
- ✅ **Javítás**:
  - Standard transitions: `duration-500`
  - Hover effects: `duration-300`
  - Complex animations: `duration-700`

#### B. Framer Motion Delays
- ❌ **Probléma**: Néhol nincs stagger effect a listáknál
- ✅ **Javítás**: Minden map-nél használjunk `delay: i * 0.1` vagy `delay: i * 0.15`

### 5. **Responsive Design Problémák**

#### A. Mobile Padding
- ❌ **Probléma**: Néhány helyen túl kicsi a mobile padding (`px-4`)
- ✅ **Javítás**: `px-4 md:px-6 lg:px-8` vagy `container mx-auto px-4`

#### B. Font Sizes
- ❌ **Probléma**: Néhány `text-7xl` túl nagy mobilon
- ✅ **Javítás**: Mindig használjunk responsive font sizes
  - `text-4xl md:text-6xl lg:text-7xl`
  - `text-2xl md:text-3xl lg:text-4xl`

### 6. **Specifikus Oldal Problémák**

#### Scriptek oldal (`/szolgaltatasok/scriptek`)
- ❌ **Probléma**: Pricing section háttér `bg-transparent` helyett `bg-slate-950` volt (JAVÍTVA ✅)
- ❌ **Probléma**: `t.rich` helyett `tServices.rich` használata (JAVÍTVA ✅)

#### Rendszerüzemeltetés oldal
- ❌ **Probléma**: "Complex" plan ára nem jelenik meg helyesen
- ✅ **Javítás**: Egységes `priceFrom` logika alkalmazása

#### Biztonság oldal
- ❌ **Probléma**: `priceText` és `price` keveredése
- ✅ **Javítás**: Egységes pricing display komponens

---

## 🐛 FUNKCIONÁLIS HIBÁK

### 1. **Lint Errors (Kritikus)**

#### A. CRM.ts - Status Property
```typescript
// Fájl: src/app/actions/crm.ts:63
// Hiba: 'status' does not exist in type LeadCreateInput
```
- ❌ **Probléma**: Prisma schema nem tartalmazza a `status` mezőt a Lead modellben
- ✅ **Javítás**: Ellenőrizni kell a `prisma/schema.prisma` fájlt, hogy a Lead model tartalmazza-e a `status` mezőt

#### B. Finance.ts - Transaction vs $transaction
```typescript
// Fájl: src/app/actions/finance.ts:8, 22, 65
// Hiba: Property 'transaction' does not exist. Did you mean '$transaction'?
```
- ❌ **Probléma**: `prisma.transaction` helyett `prisma.$transaction` kellene
- ✅ **Javítás**: Átírni `$transaction`-re

#### C. Finance.ts - FinancialSubscription
```typescript
// Fájl: src/app/actions/finance.ts:38, 52
// Hiba: Property 'financialSubscription' does not exist
```
- ❌ **Probléma**: Prisma client nem tartalmazza ezt a modelt
- ✅ **Javítás**: `npx prisma generate` újrafuttatása vagy schema ellenőrzése

### 2. **Missing Translations**
- ❌ **Probléma**: TODO a landing pages config-ban: `videoUrl: "" // TODO: Add sales video`
- ✅ **Javítás**: Sales video hozzáadása vagy a mező eltávolítása

### 3. **Performance Issues**

#### A. Neural Network Background
- ⚠️ **Figyelmeztetés**: Canvas animáció CPU-intenzív lehet mobilon
- ✅ **Javítás**: 
  - Reduced motion support hozzáadása
  - Mobile-on egyszerűbb verzió vagy kikapcsolás
  - `requestAnimationFrame` throttling

---

## 📱 MOBILE EXPERIENCE JAVÍTÁSOK

### 1. **Touch Targets**
- ❌ **Probléma**: Néhány gomb/link túl kicsi mobilon (< 44px)
- ✅ **Javítás**: Minimum `h-12` vagy `h-14` gomboknál

### 2. **Horizontal Scroll**
- ❌ **Probléma**: Néhány grid túlcsordul mobilon
- ✅ **Javítás**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` használata

### 3. **Font Sizes**
- ❌ **Probléma**: Néhány `text-[10px]` túl kicsi mobilon
- ✅ **Javítás**: Minimum `text-xs` (12px) használata

---

## 🎯 PROFESSZIONÁLIS POLISH

### 1. **Loading States**
- ❌ **Hiányzik**: Nincs loading state a form submit-eknél
- ✅ **Javítás**: Skeleton loaderek és spinner komponensek hozzáadása

### 2. **Error Handling**
- ❌ **Hiányzik**: Nincs user-friendly error message sok helyen
- ✅ **Javítás**: Toast notifications vagy inline error messages

### 3. **Empty States**
- ❌ **Hiányzik**: Nincs empty state a listáknál (pl. admin CRM)
- ✅ **Javítás**: Illusztrációk és CTA-k hozzáadása

### 4. **Accessibility**
- ❌ **Hiányzik**: Néhol nincs `aria-label` vagy `alt` text
- ✅ **Javítás**: 
  - Minden képhez `alt` text
  - Minden interaktív elemhez `aria-label`
  - Keyboard navigation tesztelése

### 5. **SEO**
- ⚠️ **Ellenőrizni**: Meta descriptions, Open Graph tags
- ✅ **Javítás**: Minden oldalhoz egyedi meta description

---

## 🚀 IMPLEMENTÁCIÓS PRIORITÁSOK

### 🔴 **P0 - Kritikus (Azonnal)**
1. ✅ Lint errors javítása (CRM, Finance)
2. ✅ Árak módosítása reális értékekre
3. ✅ Pricing display egységesítése

### 🟠 **P1 - Magas (1-2 nap)**
4. Színek és kontrasztok javítása
5. Spacing egységesítése
6. Responsive design problémák
7. Mobile touch targets

### 🟡 **P2 - Közepes (1 hét)**
8. Animációk finomhangolása
9. Loading states hozzáadása
10. Error handling javítása
11. Accessibility audit

### 🟢 **P3 - Alacsony (Later)**
12. Empty states
13. Performance optimalizálás
14. SEO audit
15. A/B testing setup

---

## 📝 KÖVETKEZŐ LÉPÉSEK

1. **Árak frissítése** az összes szolgáltatási oldalon
2. **Lint errors javítása** (CRM, Finance)
3. **UI konzisztencia** javítások batch-elve
4. **Mobile testing** és javítások
5. **Accessibility audit** és javítások
6. **Performance audit** (Lighthouse)
7. **Final QA** minden oldalon

**Becsült idő**: 2-3 munkanap a P0-P1 feladatokra
