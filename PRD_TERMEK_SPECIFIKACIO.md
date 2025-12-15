# 🎯 BacklineIT Platform — Termék Követelmény Dokumentáció (PRD)

**Dokumentum típus:** Product Requirements Document (PRD)  
**Verzió:** 1.0.0  
**Dátum:** 2025. december 15.  
**Státusz:** Éles (Production Ready)  
**Tulajdonos:** BacklineIT Solutions

---

## 📋 Tartalomjegyzék

1. [Vezetői Összefoglaló](#1-vezetői-összefoglaló)
2. [Probléma Megfogalmazása](#2-probléma-megfogalmazása)
3. [Célközönség és Felhasználói Perszonák](#3-célközönség-és-felhasználói-perszonák)
4. [Termék Víziója és Célok](#4-termék-víziója-és-célok)
5. [Funkcionális Követelmények](#5-funkcionális-követelmények)
6. [Nem-Funkcionális Követelmények](#6-nem-funkcionális-követelmények)
7. [Technikai Architektúra](#7-technikai-architektúra)
8. [Adatmodell és Entitások](#8-adatmodell-és-entitások)
9. [Integrációk és Külső Szolgáltatások](#9-integrációk-és-külső-szolgáltatások)
10. [Felhasználói Folyamatok (User Flows)](#10-felhasználói-folyamatok-user-flows)
11. [Üzleti Metrikák és KPI-k](#11-üzleti-metrikák-és-kpi-k)
12. [Fejlesztési Ütemterv (Roadmap)](#12-fejlesztési-ütemterv-roadmap)
13. [Kockázatok és Megoldások](#13-kockázatok-és-megoldások)
14. [Függelék](#14-függelék)

---

## 1. Vezetői Összefoglaló

### 1.1 Mi a BacklineIT Platform?

A **BacklineIT Platform** egy integrált digitális üzleti rendszer, amely ötvözi:

- 🛒 **E-commerce webshopot** digitális termékek értékesítésére
- 🎫 **Ügyfélportált** licenckezeléshez és support ticket rendszerhez  
- 🤖 **Automatizációs motort** (n8n) a háttérfolyamatok kezelésére
- 📊 **Admin felületet** a teljes körű üzletmenedzsmenthez

### 1.2 Kiemelt Értékek

| Dimenzió | Érték |
|:---------|:------|
| **Sebesség** | Next.js 16 alapú, SSR/SSG hibrid rendering villámgyors betöltéshez |
| **Biztonság** | OAuth 2.0 autentikáció, PCI-DSS kompatibilis fizetés |
| **Automatizáció** | n8n workflow engine az emberi adminisztráció minimalizálására |
| **Skálázhatóság** | Serverless architektúra (Vercel + Neon DB) |
| **Nemzetköziség** | Többnyelvű támogatás (HU/EN) előkészítve |

### 1.3 Jelenlegi Státusz

> [!NOTE]
> A platform **éles (production) állapotban** működik a https://backlineit.hu címen, Vercel hostingon.

---

## 2. Probléma Megfogalmazása

### 2.1 Piaci Probléma

A magyar IT szolgáltatási piacon a kisvállalkozások az alábbi problémákkal szembesülnek:

1. **Magas adminisztrációs teher** — Manuális számlázás, lead kezelés, ügyfélkommunikáció
2. **Elavult technológiák** — WordPress és más legacy rendszerek lassúak és sérülékenyek
3. **Töredezett eszközök** — Külön rendszer az értékesítéshez, supporthoz, CRM-hez
4. **Méretgazdaságossági hátrány** — Drága enterprise megoldások vs. egyedi fejlesztés költségei

### 2.2 Célolt Megoldás

A BacklineIT Platform egyetlen, integrált rendszerben nyújtja az alábbi komponenseket:

**Rendszer Integrációs Folyamat:**

1. **Értékesítés (Webshop)** → Termékek böngészése, kosár, checkout
2. **Automatizáció (n8n Engine)** → Háttérfolyamatok kezelése (számlázás, értesítések)
3. **Ügyfélkezelés (Portal + Tickets)** → Licencek, support jegyek kezelése
4. **Analitika (Admin Dashboard)** → KPI-k, statisztikák, döntéstámogatás

*A rendszer zárt körben működik: az analitika eredményei visszacsatolnak az értékesítési folyamatba.*

---

## 3. Célközönség és Felhasználói Perszonák

### 3.1 Elsődleges Célcsoport

**B2B kis- és középvállalkozások** (KKV-k) Magyarországon és a DACH régióban, amelyek:

- Digitalizálni szeretnék üzleti folyamataikat
- Keresnek megbízható IT szolgáltatásokat
- Automatizálnák az ismétlődő feladatokat

### 3.2 Felhasználói Perszonák

#### 👨‍💼 1. Perszóna: "Digitális Kisvállalkozó" (Márk, 38)

| Jellemző | Leírás |
|:---------|:-------|
| **Szerep** | E-commerce webáruház tulajdonos |
| **Fájdalompont** | "Heti 5+ órát töltök számlázással és email válaszolással" |
| **Cél** | Automatizálni a repetitív feladatokat |
| **Vásárlási motíváció** | WooCommerce pluginok, n8n workflow-k |

#### 👩‍💻 2. Perszóna: "IT Vezető" (Anna, 45)

| Jellemző | Leírás |
|:---------|:-------|
| **Szerep** | 50+ fős cég IT igazgatója |
| **Fájdalompont** | "Nincs megbízható partnerünk egyedi fejlesztésekhez" |
| **Cél** | Modern, biztonságos webalkalmazások |
| **Vásárlási motíváció** | Egyedi webfejlesztés, DevOps szolgáltatások |

#### 🧑‍🎓 3. Perszóna: "Startup Alapító" (Dani, 29)

| Jellemző | Leírás |
|:---------|:-------|
| **Szerep** | Tech startup CTO |
| **Fájdalompont** | "Hónapokba telne a fizetési rendszer és auth megépítése" |
| **Cél** | Gyorsan piacra vinni az MVP-t |
| **Vásárlási motíváció** | Next.js SaaS Boilerplate |

---

## 4. Termék Víziója és Célok

### 4.1 Termék Vízió

> **"Minden magyar vállalkozás számára elérhető legyen a modern, automatizált digitális működés – nem csak a nagyvállalatoknak."**

### 4.2 Rövid távú Célok (Q1 2026)

- [ ] 100+ aktív licenc értékesítése
- [ ] 50+ support ticket sikeres lezárása
- [ ] 5+ egyedi fejlesztési projekt indítása
- [ ] Hírlevél lista növelése 500+ feliratkozóra

### 4.3 Középtávú Célok (Q2-Q3 2026)

- [ ] Affiliate program bevezetése 20+ partnerrel
- [ ] Német nyelvű lokalizáció (DACH piac)
- [ ] PWA mobil alkalmazás

### 4.4 Hosszú távú Célok (Q4 2026+)

- [ ] API platform más fejlesztők számára
- [ ] AI-alapú chatbot integráció
- [ ] Fehér címkés (white-label) értékesítés
- [ ] Nemzetközi expanzió (DACH régió, CEE)

---

## 5. Funkcionális Követelmények

### 5.1 Modul Áttekintés

| Modul Kategória | Funkciók |
|:----------------|:---------|
| **Publikus Modulok** | 🏠 Home Page<br/>📦 Termék Katalógus<br/>📝 Blog / Tudásbázis<br/>📞 Kapcsolat / Ajánlatkérés<br/>ℹ️ Rólunk / Referenciák |
| **E-commerce Modul** | 🛒 Kosár<br/>💳 Checkout / Fizetés<br/>🔑 Licenc Generálás |
| **Ügyfél Portál** | 📋 Dashboard<br/>🎫 Ticket Rendszer<br/>📜 Licenc Kezelés<br/>📥 Letöltések |
| **Admin Felület** | 📊 Statisztikák<br/>👥 Felhasználó Kezelés<br/>📦 Termék Kezelés<br/>🎫 Ticket Admin |

---

### 5.2 Részletes Funkciók

#### 5.2.1 🌐 Publikus Weboldal

| Funkció | Prioritás | Státusz | Leírás |
|:--------|:----------|:--------|:-------|
| **Landing Page** | P0 | ✅ Kész | Hero szekció, szolgáltatások, testimonialok, CTA |
| **Szolgáltatás Oldalak** | P0 | ✅ Kész | Webfejlesztés, Automatizáció, DevOps, Biztonság |
| **Termék Katalógus** | P0 | ✅ Kész | Kategorizált terméklistázás, szűrés |
| **Termék Részletek** | P0 | ✅ Kész | Leírás, árazás, features, kosárba rakás |
| **Blog Rendszer** | P1 | ✅ Kész | MDX alapú cikkek, kategóriák, kereső |
| **Kapcsolat Form** | P0 | ✅ Kész | n8n integrált űrlap, Turnstile CAPTCHA |
| **Referenciák** | P1 | ✅ Kész | Esettanulmányok bemutatása |
| **Árak Oldal** | P1 | ✅ Kész | Árkalkulátor, csomagok összehasonlítása |
| **Demo Oldal** | P2 | ✅ Kész | Interaktív termékkipróbálás |

#### 5.2.2 🛒 E-commerce Modul

| Funkció | Prioritás | Státusz | Leírás |
|:--------|:----------|:--------|:-------|
| **Kosár Kezelés** | P0 | ✅ Kész | Hozzáadás, törlés, mennyiség módosítás (localStorage) |
| **Checkout Folyamat** | P0 | ✅ Kész | Regisztráció, adatok, fizetés |
| **SimplePay Integráció** | P0 | ✅ Kész | Online kártyás fizetés |
| **Licenc Generálás** | P0 | ✅ Kész | Automatikus egyedi kulcs létrehozás vásárlás után |
| **Rendelés Visszaigazolás** | P0 | ✅ Kész | Email értesítés (n8n webhook) |
| **Kupon Rendszer** | P2 | 🔄 Tervezett | Kedvezménykódok kezelése |

#### 5.2.3 🎫 Ügyfélportál (Dashboard)

| Funkció | Prioritás | Státusz | Leírás |
|:--------|:----------|:--------|:-------|
| **Bejelentkezés** | P0 | ✅ Kész | OAuth (Google, GitHub) + email/jelszó |
| **Email Verifikáció** | P0 | ✅ Kész | n8n workflow alapú |
| **Dashboard Áttekintés** | P0 | ✅ Kész | Statisztikák, gyors műveletek |
| **Licenc Lista** | P0 | ✅ Kész | Aktív licencek, lejáratok |
| **Ticket Létrehozás** | P0 | ✅ Kész | Kategória, prioritás, leírás |
| **Ticket Válaszok** | P0 | ✅ Kész | Üzenetváltás a support csapattal |
| **Letöltések** | P1 | ✅ Kész | Digitális termékek elérése |
| **Affiliate Dashboard** | P2 | ✅ Kész | Referral link, statisztikák |

#### 5.2.4 🔧 Admin Felület

| Funkció | Prioritás | Státusz | Leírás |
|:--------|:----------|:--------|:-------|
| **Védett Hozzáférés** | P0 | ✅ Kész | Csak ADMIN szerepkörrel |
| **Felhasználó Lista** | P0 | ✅ Kész | Keresés, szűrés, szerepkör módosítás |
| **Termék CRUD** | P0 | ✅ Kész | Létrehozás, szerkesztés, törlés |
| **Rendelés Lista** | P0 | ✅ Kész | Státusz kezelés, szűrés |
| **Ticket Kezelés** | P0 | ✅ Kész | Hozzárendelés, válasz, lezárás |
| **Licenc Kezelés** | P1 | ✅ Kész | Manuális létrehozás, deaktiválás |
| **Analytics Dashboard** | P2 | 🔄 Fejlesztés alatt | Recharts alapú grafikonok |

---

## 6. Nem-Funkcionális Követelmények

### 6.1 Teljesítmény (Performance)

| Metrika | Cél Érték | Mérés Módja |
|:--------|:----------|:------------|
| **LCP (Largest Contentful Paint)** | < 2.5s | Vercel Analytics, Lighthouse |
| **FID (First Input Delay)** | < 100ms | Web Vitals |
| **CLS (Cumulative Layout Shift)** | < 0.1 | Lighthouse |
| **API Válaszidő** | < 500ms | Sentry monitoring |
| **Adatbázis Lekérdezés** | < 100ms | Prisma query logs |

### 6.2 Rendelkezésre Állás

| Követelmény | Cél |
|:------------|:----|
| **Uptime SLA** | 99.9% (évi max 8.76 óra leállás) |
| **RTO (Recovery Time Objective)** | < 1 óra |
| **RPO (Recovery Point Objective)** | < 24 óra |

### 6.3 Biztonság

| Követelmény | Megvalósítás |
|:------------|:-------------|
| **Autentikáció** | OAuth 2.0 (Auth.js), opcionális jelszó |
| **Autorizáció** | RBAC (USER, ADMIN szerepkörök) |
| **Adatvédelem** | GDPR megfelelés, Cookie Banner |
| **Fizetés** | PCI-DSS (SimplePay SaaS megoldás) |
| **HTTPS** | TLS 1.3, Cloudflare SSL |
| **CAPTCHA** | Cloudflare Turnstile |
| **XSS védelem** | React auto-escaping, CSP headers |

### 6.4 Skálázhatóság

| Dimenzió | Támogatott Tartomány |
|:---------|:---------------------|
| **Konkurens felhasználók** | 1,000+ |
| **Adatbázis rekordok** | 100,000+ |
| **Fájl tárolás** | Vercel Blob Storage |

### 6.5 Lokalizáció (i18n)

| Nyelv | Státusz |
|:------|:--------|
| 🇭🇺 Magyar | ✅ Teljes |
| 🇬🇧 Angol | ✅ Teljes |
| 🇩🇪 Német | 🔄 Tervezett |

---

## 7. Technikai Architektúra

### 7.1 Rendszer Architektúra

| Réteg | Komponensek | Kapcsolatok |
|:------|:------------|:------------|
| **Client Layer** | 🌐 Web Browser<br/>📱 PWA (Tervezett) | → Edge Network |
| **Edge Network** | ☁️ Cloudflare (CDN + WAF + Email) | → Application Layer |
| **Application Layer** | ⚛️ Next.js 16 (App Router)<br/>🔌 API Routes & Server Actions<br/>🔐 Auth.js (OAuth + Credentials) | → Data Layer<br/>→ Automation Layer<br/>→ External Services |
| **Data Layer** | 🐘 Neon PostgreSQL (Serverless)<br/>🔷 Prisma ORM | ← Application API |
| **Automation Layer** | 🤖 n8n Cloud (Workflow Engine) | ← Webhooks from API<br/>→ Email notifications<br/>→ External integrations |
| **External Services** | 💳 SimplePay<br/>📄 Számlázz.hu<br/>🔍 Sentry<br/>📊 Google Analytics | ← Direct integration from App |

**Adatfolyam:**
- Felhasználó → Cloudflare Edge → Next.js App → API Layer
- API → Prisma ORM → Neon Database (adatok)
- API → n8n Webhook → Automatizált folyamatok (email, számlázás)
- App → SimplePay → Fizetési tranzakció
- App → Sentry/Analytics → Monitoring

### 7.2 Technológiai Stack Részletezése

#### Frontend

| Technológia | Verzió | Funkció |
|:------------|:-------|:--------|
| **Next.js** | 16.x | React keretrendszer, SSR/SSG |
| **React** | 19.x | UI könyvtár |
| **TypeScript** | 5.x | Típusbiztos JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS |
| **Radix UI** | Latest | Akadálymentes komponensek |
| **Framer Motion** | 12.x | Animációk |
| **Lucide Icons** | Latest | Ikonkészlet |
| **Recharts** | 3.x | Grafikonok |

#### Backend

| Technológia | Verzió | Funkció |
|:------------|:-------|:--------|
| **Next.js API Routes** | 16.x | REST API végpontok |
| **Server Actions** | Next.js | Szerver oldali műveletek |
| **Prisma ORM** | 5.22 | Adatbázis absztrakció |
| **Auth.js** | 5.x (Beta) | Autentikáció |
| **Zod** | 4.x | Validáció |

#### Infrastruktúra

| Szolgáltatás | Funkció |
|:-------------|:--------|
| **Vercel** | Hosting, Edge Network, Analytics |
| **Neon** | Serverless PostgreSQL |
| **Cloudflare** | CDN, DDoS védelem, Email Routing, Turnstile |
| **n8n Cloud** | Workflow automatizáció |
| **Sentry** | Hibakövetés, monitoring |

---

## 8. Adatmodell és Entitások

### 8.1 Entitás Kapcsolatok

| Entitás 1 | Kapcsolat | Entitás 2 | Leírás |
|:----------|:----------|:----------|:-------|
| **User** | 1:N | Order | Egy felhasználó több rendelést adhat le |
| **User** | 1:N | License | Egy felhasználó több licenccel rendelkezhet |
| **User** | 1:N | Ticket | Egy felhasználó több ticketet nyithat |
| **User** | 1:N | TicketReply | Egy felhasználó több ticket választ írhat |
| **User** | 1:N | ReferralReward | Egy felhasználó több jutalomban részesülhet |
| **User** | 1:N | ReferralClick | Egy felhasználó több referral kattintást generálhat |
| **User** | 1:N | Account | OAuth provider kapcsolatok |
| **User** | 1:N | Session | Aktív session munkamenetek |
| **Order** | 1:N | OrderItem | Egy rendelés több tételt tartalmazhat |
| **Order** | 1:N | License | Egy rendelés több licencet generálhat |
| **OrderItem** | N:1 | Product | Több rendelési tétel hivatkozhat egy termékre |
| **License** | N:1 | Product | Több licenc tartozhat egy termékhez |
| **Ticket** | 1:N | TicketReply | Egy tickethez több válasz tartozhat |

### 8.2 Fő Entitások

#### User (Felhasználó)

| Mező | Típus | Leírás |
|:-----|:------|:-------|
| id | String (CUID) | Egyedi azonosító |
| name | String? | Teljes név |
| email | String (unique) | Email cím |
| password | String? | Hashelt jelszó (bcrypt) |
| role | String | USER / ADMIN |
| emailVerified | DateTime? | Email megerősítés ideje |
| referralCode | String? (unique) | Egyedi affiliate kód |
| referredBy | String? | Ki ajánlotta |

#### Product (Termék)

| Mező | Típus | Leírás |
|:-----|:------|:-------|
| id | String (CUID) | Egyedi azonosító |
| name | String | Termék neve |
| description | String | Rövid leírás |
| longDescription | String? | Részletes leírás (Markdown) |
| price | Int | Ár (HUF, fillérben) |
| category | String | Kategória (SCRIPT, PLUGIN, TEMPLATE, EBOOK, WORKFLOW) |
| slug | String (unique) | URL-barát azonosító |
| image | String | Kép URL |
| features | String | Funkciók listája (JSON) |
| prices | String | Árszintek (JSON) |
| active | Boolean | Aktív-e |

#### Order (Rendelés)

| Mező | Típus | Leírás |
|:-----|:------|:-------|
| id | String (CUID) | Egyedi azonosító |
| orderRef | String (unique) | Rendelési szám (pl. BIT-2025-001) |
| totalAmount | Int | Végösszeg (fillérben) |
| currency | String | Pénznem (HUF) |
| status | String | PENDING / PAID / CANCELLED / REFUNDED |
| paymentMethod | String | SIMPLEPAY / TRANSFER / PAYPAL |
| customerEmail | String | Vásárló email |
| customerName | String? | Vásárló neve |
| userId | String? | Bejelentkezett felhasználó ID |

#### Ticket (Hibajegy)

| Mező | Típus | Leírás |
|:-----|:------|:-------|
| id | String (CUID) | Egyedi azonosító |
| ticketNumber | String (unique) | Jegyszám (pl. TKT-001234) |
| subject | String | Tárgy |
| description | String | Részletes leírás |
| status | String | OPEN / IN_PROGRESS / WAITING_FOR_CUSTOMER / RESOLVED / CLOSED |
| priority | String | LOW / MEDIUM / HIGH / URGENT |
| category | String | TECHNICAL / BILLING / GENERAL / BUG_REPORT |
| userId | String | Beküldő felhasználó |
| assignedToId | String? | Hozzárendelt admin |

#### License (Licenc)

| Mező | Típus | Leírás |
|:-----|:------|:-------|
| id | String (CUID) | Egyedi azonosító |
| key | String (unique) | Licenckulcs (pl. XXXX-XXXX-XXXX-XXXX) |
| type | String | SINGLE / MULTI / UNLIMITED |
| status | String | ACTIVE / SUSPENDED / EXPIRED |
| userId | String? | Tulajdonos |
| orderId | String? | Kapcsolódó rendelés |
| productId | String? | Kapcsolódó termék |

---

## 9. Integrációk és Külső Szolgáltatások

### 9.1 Integráció Mátrix

| Szolgáltatás | Típus | Státusz | Funkció |
|:-------------|:------|:--------|:--------|
| **SimplePay** | Fizetés | ✅ Éles | Online bankkártyás fizetés |
| **Számlázz.hu** | Számlázás | 🔄 n8n | Automatikus számlakiállítás |
| **Auth.js (OAuth)** | Autentikáció | ✅ Éles | Google, GitHub bejelentkezés |
| **Cloudflare** | CDN + Email | ✅ Éles | Edge hálózat, email routing |
| **n8n** | Automatizáció | ✅ Éles | Webhook-alapú workflow-k |
| **Sentry** | Monitoring | ✅ Éles | Hiba és teljesítmény figyelés |
| **Google Analytics** | Analitika | ✅ Éles | Látogatottsági statisztikák |
| **Vercel Analytics** | Teljesítmény | ✅ Éles | Web Vitals |
| **Google Search Console** | SEO | ✅ Konfigurált | Indexelés, keresési adatok |

### 9.2 n8n Workflow-k

| Workflow | Trigger | Akció |
|:---------|:--------|:------|
| **Email Verification** | Regisztráció | Verification email küldés |
| **Ticket Created** | Új ticket | Admin értesítés + visszaigazoló email |
| **Lead Capture** | Form kitöltés | CRM mentés + email |
| **Order Completed** | Fizetés sikeres | Számla kiállítás + licenc aktiválás |
| **Newsletter Subscribe** | Feliratkozás | Üdvözlő email + lista hozzáadás |

---

## 10. Felhasználói Folyamatok (User Flows)

### 10.1 Vásárlási Folyamat

| # | Szereplő | Akció | Eredmény |
|:--|:---------|:------|:---------|
| 1 | Felhasználó | Termék böngészése a katalógusban | Termék részletek oldal megjelenítése |
| 2 | Felhasználó | "Kosárba" gomb kattintás | Termék hozzáadása a localStorage kosárhoz |
| 3 | Felhasználó | Checkout indítás a kosárból | Átirányítás checkout oldalra |
| 4a | Rendszer (bejelentkezett) | Fiók adatok automatikus kitöltése | Név, email előre kitöltve |
| 4b | Rendszer (vendég) | Adatok bekérése | Felhasználó megadja név, email címet |
| 5 | Weboldal | SimplePay fizetési session létrehozása | SimplePay átirányító URL generálása |
| 6 | SimplePay | Fizetési oldal megjelenítése | Felhasználó látja a kártyaadatok formot |
| 7 | Felhasználó | Kártyaadatok megadása és fizetés | SimplePay feldolgozza a tranzakciót |
| 8 | SimplePay | IPN webhook küldése (sikeres) | Weboldal API fogadja a callback-et |
| 9 | Adatbázis | Rendelés státusz frissítés | Status: PENDING → PAID |
| 10 | Adatbázis | Licenckulcs generálás | Egyedi licenc létrehozása és hozzárendelése |
| 11 | n8n | Webhook trigger fogadása | Automatizált workflow indítása |
| 12 | n8n | Email küldés + számla generálás | Visszaigazoló email licenckulccsal |
| 13 | Weboldal | Success oldal megjelenítése | Köszönjük oldal + licenckulcs megjelenítés |

### 10.2 Support Ticket Folyamat

**Ticket Létrehozás (Felhasználó):**

| # | Szereplő | Akció | Eredmény |
|:--|:---------|:------|:---------|
| 1 | Felhasználó | Bejelentkezés a dashboardra | Belépés OAuth vagy email/jelszó |
| 2 | Felhasználó | "Új Ticket" gomb kattintás | Ticket létrehozó form megjelenítése |
| 3 | Felhasználó | Kategória, prioritás, leírás megadása | Form kitöltése |
| 4 | Dashboard | POST /api/tickets hívás | API fogadja az adatokat |
| 5 | Adatbázis | Ticket mentése egyedi számmal | TKT-XXXXXX generálás |
| 6 | n8n | Webhook trigger (ticket_created) | Automatizált workflow indítása |
| 7 | n8n | Admin email értesítés küldése | Email adminoknak új ticketről |
| 8 | n8n | Felhasználói visszaigazoló email | "Ticketedet fogadtuk" email |

**Ticket Válaszadás (Admin):**

| # | Szereplő | Akció | Eredmény |
|:--|:---------|:------|:---------|
| 9 | Admin | Admin panel megnyitás | /admin/tickets oldal |
| 10 | Admin | Ticket kiválasztása és megtekintése | Ticket részletek + történet |
| 11 | Admin | Válasz írása | Reply form kitöltése |
| 12 | Dashboard | POST /api/tickets/[id]/reply | API fogadja a választ |
| 13 | Adatbázis | TicketReply mentése | isStaffReply: true flag |
| 14 | n8n | Webhook trigger (ticket_replied) | Automatizált értesítés |
| 15 | n8n | Felhasználói email küldése | "Választ kaptál" email linkkel |

---

## 11. Üzleti Metrikák és KPI-k

### 11.1 Növekedési Mutatók

| Metrika | Definíció | Cél (Q1 2026) |
|:--------|:----------|:--------------|
| **MRR** | Havi Visszatérő Bevétel | 500,000 HUF |
| **Új Regisztrációk** | Havi új felhasználók | 50+ |
| **Aktív Licencek** | Aktív státuszú licencek | 100+ |
| **Ticket Megoldási Idő** | Átlagos válaszidő | < 24 óra |

### 11.2 Konverziós Mutatók

| Metrika | Definíció | Cél |
|:--------|:----------|:----|
| **Visitor → Lead** | Látogató → feliratkozó | 5%+ |
| **Lead → Trial** | Feliratkozó → próbafelhasználó | 20%+ |
| **Trial → Paid** | Próba → fizetős | 10%+ |
| **Cart Abandonment** | Kosárelhagyási arány | < 70% |

### 11.3 Technikai Mutatók

| Metrika | Cél |
|:--------|:----|
| **Lighthouse Score** | 90+ (Performance, SEO, A11y) |
| **Error Rate** | < 0.1% |
| **API Availability** | 99.9%+ |
| **Deploy Frequency** | 10+ / hónap |

---

## 12. Fejlesztési Ütemterv (Roadmap)

### 12.1 Aktuális Verzió (v1.0) — ✅ Megvalósítva

- [x] Publikus weboldal (Next.js)
- [x] E-commerce modul (Kosár, Checkout, SimplePay)
- [x] Ügyfélportál (Dashboard, Tickets, Licenses)
- [x] Admin felület (Users, Products, Orders, Tickets)
- [x] n8n integrációk (Email verification, Tickets)
- [x] OAuth autentikáció (Google, GitHub)
- [x] Többnyelvűség alapok (HU/EN)

### 12.2 v1.1 — Q1 2026

- [ ] 📊 Admin Analytics Dashboard (grafikonok, KPI-k)
- [ ] 💬 AI Chatbot integráció (OpenAI alapú)
- [ ] 🎁 Kuponrendszer (kedvezménykódok)
- [ ] 📧 Email template szerkesztő

### 12.3 v1.2 — Q2 2026

- [ ] 🤝 Affiliate Program teljes körű
- [ ] 🇩🇪 Német lokalizáció
- [ ] 📱 PWA (Progressive Web App)
- [ ] 🔍 Keresőmező (Fuzzy search)

### 12.4 v2.0 — Q4 2026

- [ ] 🏗️ API Platform (külső fejlesztőknek)
- [ ] 🏷️ White-label megoldás
- [ ] 📊 Haladó riportolás
- [ ] 🔄 Subscription billing (előfizetéses modell)
- [ ] 🌍 Nemzetközi expanzió (DACH)

---

## 13. Kockázatok és Megoldások

### 13.1 Technikai Kockázatok

| Kockázat | Valószínűség | Hatás | Mitigáció |
|:---------|:-------------|:------|:----------|
| **Adatbázis leállás** | Alacsony | Kritikus | Neon auto-failover, napi backup |
| **API túlterhelés** | Közepes | Közepes | Vercel Edge caching, rate limiting |
| **Auth.js Beta bugok** | Közepes | Közepes | Fallback auth, core team követés |

### 13.2 Üzleti Kockázatok

| Kockázat | Valószínűség | Hatás | Mitigáció |
|:---------|:-------------|:------|:----------|
| **Alacsony konverzió** | Közepes | Magas | A/B tesztelés, UX optimalizáció |
| **Fizetési visszaélés** | Alacsony | Közepes | SimplePay fraud detection |
| **GDPR incidens** | Alacsony | Kritikus | Privacy by Design, DPO |

### 13.3 Versenytársi Kockázatok

| Kockázat | Valószínűség | Hatás | Mitigáció |
|:---------|:-------------|:------|:----------|
| **Magyar versenytársak** | Magas | Közepes | Differenciálás (n8n, automatizáció) |
| **Nemzetközi platformok** | Közepes | Közepes | Lokális jelenlét, magyar támogatás |

---

## 14. Függelék

### 14.1 Kapcsolódó Dokumentumok

| Dokumentum | Leírás |
|:-----------|:-------|
| [RESZLETES_DOKUMENTACIO.md](./RESZLETES_DOKUMENTACIO.md) | Technikai dokumentáció |
| [ERTEKESITOI_KEZIKONYV.md](./ERTEKESITOI_KEZIKONYV.md) | Sales kézikönyv |
| [ADMIN_MANUAL.md](./ADMIN_MANUAL.md) | Admin használati útmutató |
| [DEMO_MANUAL.md](./DEMO_MANUAL.md) | Demo bemutatási segédlet |
| [FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md) | Fejlesztési ötletek |
| [LAUNCH_CHECKLIST_LEGAL_FINANCE.md](./LAUNCH_CHECKLIST_LEGAL_FINANCE.md) | Indítási checklist |

### 14.2 URL Struktúra

| URL | Leírás |
|:----|:-------|
| `/` | Főoldal |
| `/szolgaltatasok/*` | Szolgáltatás részletek |
| `/termekek` | Termék katalógus |
| `/termekek/[slug]` | Termék részletek |
| `/blog` | Blog lista |
| `/blog/[slug]` | Blog cikk |
| `/dashboard` | Ügyfél portál |
| `/dashboard/tickets` | Ticket lista |
| `/dashboard/licenses` | Licenc lista |
| `/admin` | Admin felület |
| `/login` | Bejelentkezés |
| `/register` | Regisztráció |
| `/checkout` | Pénztár |
| `/payment/*` | Fizetési oldalak |
| `/kapcsolat` | Kapcsolat |
| `/rolunk` | Rólunk |
| `/referenciak` | Esettanulmányok |
| `/arak` | Árazás |
| `/aszf` | ÁSZF |
| `/adatvedelem` | Adatvédelem |
| `/impresszum` | Impresszum |

### 14.3 Környezeti Változók

| Változó | Leírás |
|:--------|:-------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `DIRECT_URL` | Direct database connection |
| `NEXTAUTH_SECRET` | Auth.js titkosítási kulcs |
| `NEXTAUTH_URL` | Alkalmazás alap URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_ID` | GitHub OAuth client ID |
| `GITHUB_SECRET` | GitHub OAuth client secret |
| `SIMPLEPAY_*` | SimplePay API kulcsok |
| `N8N_WEBHOOK_URL` | n8n webhook URL |
| `SENTRY_DSN` | Sentry projekt DSN |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile titkos kulcs |

---

**© 2025 BacklineIT Solutions. Minden jog fenntartva.**

*Készítette: Product & Engineering Team*
