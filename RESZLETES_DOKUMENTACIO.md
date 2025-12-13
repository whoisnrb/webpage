# 📘 BacklineIT Platform - Részletes Műszaki és Üzleti Dokumentáció

**Verzió:** 1.0.0  
**Dátum:** 2025. december 13.  
**Státusz:** Éles (Production)

---

## 📋 Tartalomjegyzék

1. [Vezetői Összefoglaló](#1-vezetői-összefoglaló)
2. [Rendszer Architektúra](#2-rendszer-architektúra)
3. [Technológiai Stack](#3-technológiai-stack)
4. [Projekt Struktúra és Kódbarzis](#4-projekt-struktúra-és-kódbarzis)
5. [Üzleti Funkciók és Modulok](#5-üzleti-funkciók-és-modulok)
6. [Biztonság és Adatvédelem](#6-biztonság-és-adatvédelem)
7. [Fejlesztési Ütemterv (Roadmap)](#7-fejlesztési-ütemterv-roadmap)

---

## 1. Vezetői Összefoglaló

A **BacklineIT Platform** egy modern, nagy teljesítményű webalkalmazás, amelynek célja az IT szolgáltatások és digitális termékek (scriptek, szoftverek) értékesítésének és kiszolgálásának automatizálása. A rendszer nem csupán egy weboldal, hanem egy integrált üzleti motor, amely összeköti az értékesítést (E-commerce), az ügyfélkezelést (Dashboard) és a háttérfolyamatokat (n8n Automatizáció).

**Kiemelt Előnyök:**
*   **🚀 Sebesség és Performancia:** Next.js alapú architektúra a villámgyors betöltésért és kiváló SEO-ért.
*   **🤖 Automatizáció:** Az emberi adminisztráció minimalizálása n8n workflow-k segítségével (számlázás, jegykezelés, onboarding).
*   **🔒 Biztonság:** Modern autentikáció (Auth.js), típusbiztos kód (TypeScript) és biztonságos adatbázis-kapcsolatok (Prisma).
*   **🌍 Skálázhatóság:** Cloud-native felépítés (Vercel, Neon DB), amely felkészült a nemzetközi terjeszkedésre (i18n).

---

## 2. Rendszer Architektúra

Az alábbi diagram szemlélteti a rendszer fő komponenseinek kapcsolatait és az adatfolyamot.

```mermaid
graph TD
    User((Felhasználó))
    Admin((Adminisztrátor))

    subgraph "Frontend & Application (Vercel)"
        UI[Weboldal UI<br/>(Next.js App Router)]
        Dashboard[Ügyfél Portál]
        AdminPanel[Admin Felület]
        API[API Routes / Server Actions]
    end

    subgraph "Data & Backend Services"
        DB[(PostgreSQL DB<br/>Neon Serverless)]
        Auth[Auth.js<br/>(GitHub/Google Login)]
        Storage[Blob Storage<br/>(Assets/Images)]
    end

    subgraph "Automation Core (Brain)"
        n8n[n8n Workflow Engine]
        Webhook1[Email Processing]
        Webhook2[Ticket System]
        Webhook3[Invoice Generation]
    end

    subgraph "External Integrations"
        Stripe[Stripe / SimplePay]
        Szamlazz[Számlázz.hu]
        EmailService[Email Provider]
    end

    User -->|Böngészés & Vásárlás| UI
    User -->|Licencek & Jegyek| Dashboard
    Admin -->|Karbantartás| AdminPanel
    
    UI --> API
    Dashboard --> API
    
    API -->|Query/Mutate| DB
    API -->|Auth Check| Auth
    
    API -.->|Webhook Trigger| n8n
    n8n -->|Process Logic| Webhook1
    n8n -->|Generate PDF| Szamlazz
    n8n -->|Send Notification| EmailService
    
    UI -->|Checkout| Stripe
    Stripe -->|Payment Succeeded| API
```

---

## 3. Technológiai Stack

A projekt a legmodernebb iparági szabványokra épül a hosszú távú fenntarthatóság érdekében.

| Komponens | Technológia | Indoklás |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14** (App Router) | Piacvezető React keretrendszer, kiváló SEO, Server-Side Rendering. |
| **Nyelv** | **TypeScript** | Szigorú típusosság, kevesebb futásidejű hiba, könnyebb karbantarthatóság. |
| **Stílus** | **Tailwind CSS** | Gyors fejlesztés, konzisztens design system, kis CSS méret. |
| **UI Komponensek** | **Radix UI / Shadcn** | Akadálymentes (Accessible), testreszabható komponensek. |
| **Adatbázis** | **PostgreSQL (via Prisma)** | Robusztus relációs adatbázis sémával és típusbiztos lekérdezésekkel. |
| **Automatizáció** | **n8n** | Rugalmas workflow motor a komplex üzleti logika kiszervezésére. |
| **Hospolás** | **Vercel** | Globális CDN, automatikus skálázódás, DDoS védelem. |

---

## 4. Projekt Struktúra és Kódbarzis

A rendszer modularitásra törekszik a `src` mappán belül.

### 📂 `src/app` (Application Core)
A Next.js App Router alapja. Minden mappa egy útvonalat (URL) reprezentál.
*   `[locale]/`: Nemzetközösítés gyökérkönyvtára (többnyelvű támogatás előkészítése).
*   `api/`: Backend végpontok (pl. `/api/webhooks/stripe`, `/api/auth`).
*   `dashboard/`: A védett ügyfélzóna kódja (Licencek, Support).
*   `szolgaltatasok/`: Landing oldalak az egyes szolgáltatásokhoz (SEO optimalizált).
*   `termekek/`: Webshop termékoldalak és listázás.
*   `admin/`: Belső használatú adminisztrációs felületek.

### 📂 `src/components` (Building Blocks)
Újrafelhasználható UI elemek könyvtára.
*   `ui/`: Alapvető "atomok" (Gombok, Inputok, Kártyák, Modulok).
*   `ecommerce/`: Webshop specifikus elemek (Kosár, Pénztár, Árkalkulátor).
*   `layout/`: Globális elemek (Fejléc, Lábléc, Navigáció).
*   `sections/`: Komplett oldalszekciók (Hero, Features, Testimonials) a gyors oldalépítéshez.

### 📂 `src/lib` (Utilities)
Segédfüggvények és konfigurációk.
*   `db.ts`: Adatbázis kapcsolat kezelése.
*   `utils.ts`: Általános formázó és segédfüggvények.
*   `auth.ts`: Hitelesítési logika konfigurációja.

### 📂 `prisma/` (Database Schema)
*   `schema.prisma`: Az adatmodell definíciója (Felhasználók, Rendelések, Jegyek, Licencek).

---

## 5. Üzleti Funkciók és Modulok

### 🛍️ E-commerce Modul
*   **Dinamikus Termékkezelés**: Termékek (Scriptek, Pluginok) listázása kategóriák szerint.
*   **Kosár és Pénztár**: Integrált checkout folyamat kuponkezeléssel.
*   **Licencgenerálás**: Vásárlás után automatikus licenckulcs generálás és hozzárendelés a fiókhoz.

### 🎫 Ügyfélkapu (Client Portal)
*   **Licenc Menedzsment**: Felhasználók kezelhetik vásárolt termékeiket, domaineiket aktiválhatják.
*   **Support Ticket Rendszer**: n8n integrált hibajegy-kezelő. A felhasználó a felületről nyit jegyet -> n8n feldolgozza -> visszaigazolást küld.
*   **Letöltések**: Hozzáférés a vásárolt digitális fájlokhoz.

### 🤖 Automatizációs Hub (n8n)
A rendszer "lelke". Nem a weboldal kódja bonyolódik, hanem kiszervezzük a logikát:
*   **Lead Generálás**: Érdeklődők automatikus mentése CRM-be.
*   **Számlázás**: Sikeres fizetés után automatikus számlakiállítás (Számlázz.hu).
*   **Email Marketing**: Vásárlás utáni onboarding email sorozatok indítása.

---

## 6. Biztonság és Adatvédelem

A rendszer a "Security by Design" elvét követi:

*   **Autentikáció**:OAuth 2.0 (GitHub, Google) alapú beléptetés, jelszavak tárolása nélkül.
*   **Adatvédelem (GDPR)**: Felhasználói adatok elkülönített, biztonságos tárolása. Automatikus cookie kezelés (Cookie Banner).
*   **Fizetés**: PCI-DSS megfelelés a fizetési szolgáltató (Stripe/SimplePay) közvetlen integrációjával (kártyaadat nem érinti a szervert).
*   **Monitoring**: Sentry hibakövetés és Vercel Analytics a rendszerállapot figyelésére.

---

## 7. Fejlesztési Ütemterv (Roadmap)

A jövőbeli fejlesztések fókusza a bevételnövelés és a felhasználói élmény javítása.

*   [ ] **Affiliate Rendszer**: Partnerprogram indítása jutalékos rendszerrel.
*   [ ] **AI Bot Integráció**: Chatbot az oldalon az azonnali látogatói kérdések megválaszolására.
*   [ ] **Többnyelvűség (DE/EN)**: Teljes körű lokalizáció a DACH régió és nemzetközi piacok kiszolgálására.
*   [ ] **Mobil App (PWA)**: Telepíthető alkalmazás verzió a visszatérő ügyfeleknek.

---

© 2025 BacklineIT Solutions. Minden jog fenntartva.
