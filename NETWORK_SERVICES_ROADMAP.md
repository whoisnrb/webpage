# 🌐 Hálózati Szolgáltatások Fejlesztési Terv

**Készült:** 2026. 01. 22.  
**Státusz:** Tervezés  
**Becsült időtartam:** 2-3 hét  
**Prioritás:** ⭐⭐⭐⭐ (Nagy potenciál)

---

## 📋 Executive Summary

Új, dedikált hálózati szolgáltatások oldal létrehozása Three.js alapú 3D vizualizációval, amely:
- Kiemel a konkurencia mellett (senki más nem csinálja)
- Növeli a technikai hitelességet
- Konkrét konverzió növelés hálózati projekteknél
- Showcase-eli a technikai tudást

---

## 🎯 Célok

### Üzleti Célok
1. **Lead generálás növelése** hálózati projekteknél (+30%)
2. **Átlagos projekt érték növelés** (network = magasabb árak)
3. **Brand positioning** technológiai vezetőként
4. **SEO erősítés** hálózat-specifikus kulcsszavakra

### Technikai Célok
1. Three.js integráció Next.js 16-ba
2. Performant 3D rendering (60 FPS target)
3. Mobile-responsive fallback (2D vagy statikus kép)
4. Accessibility (screen reader support)

---

## 📊 Mai Állapot (2026.01.22)

### ✅ Már Implementált
- `/szolgaltatasok/rendszeruzemeltetes` oldal
  - ServicePillars komponens (4 pillér: Virtualizáció, **Hálózat**, Szerverek, Biztonság)
  - InfraTechStack komponens (24 technológia logó)
  - Use Cases szekció
  - Pricing táblázat
- Hálózati fordítások (hu.json, en.json)
  - `pillars.network.title`
  - `pillars.network.desc`
  - `pillars.network.features[0-3]`

### 🔄 Következő Lépés
Új dedikált oldal: `/szolgaltatasok/halozat`

---

## 🏗️ Architektúra Terv

### Oldal Struktúra

```
/szolgaltatasok/rendszeruzemeltetes
├─ Átfogó IT infrastruktúra (4 pillér)
├─ Szerepe: "Umbrella page"
└─ Link → /szolgaltatasok/halozat

/szolgaltatasok/halozat (ÚJ)
├─ Hero: 3D Network Visualization ⭐
├─ Szolgáltatások grid (VPN, VLAN, Firewall, WiFi)
├─ Interactive Features Demo
├─ Network Use Cases
├─ Tech Stack (MikroTik, Ubiquiti, pfSense detail)
├─ Case Study: Hálózati projekt referencia
└─ Pricing Calculator
```

### Komponens Hierarchia

```tsx
/szolgaltatasok/halozat/page.tsx
│
├── NetworkHero
│   ├── 3DNetworkVisualization (Three.js)
│   ├── HeroText
│   └── CTAButtons
│
├── NetworkServicesGrid
│   ├── VPNCard
│   ├── VLANCard
│   ├── FirewallCard
│   └── WiFiCard
│
├── InteractiveDemo
│   └── NetworkSimulation (click to see firewall block)
│
├── NetworkUseCases
│   └── Real-world examples
│
├── NetworkTechStack
│   └── Detailed logos + specs
│
└── NetworkPricing
    └── Calculator widget
```

---

## 🎨 3D Network Visualization - Technikai Specifikáció

### Használt Technológiák

| Tech | Verzió | Cél |
|------|--------|-----|
| **Three.js** | ^0.160.0 | 3D rendering engine |
| **@react-three/fiber** | ^8.15.0 | React wrapper Three.js-hez |
| **@react-three/drei** | ^9.95.0 | Helper komponensek (OrbitControls, Text3D) |
| **Framer Motion** | ^11.x | UI animációk (már van a projektben) |

### 3D Scene Elemek

#### Node Típusok
1. **Router** (központ) - Narancssárga gömb, forgó
2. **Switches** (2-3 db) - Kék kockák
3. **Servers** (3-4 db) - Zöld hengerek
4. **Workstations** (5-6 db) - Szürke kis gömbök
5. **Cloud** - Felhő ikon (sprite)
6. **VPN Tunnel** - Animált vonal (dashed, glowing)

#### Kapcsolatok (Edges)
- Egyszerű vonalak a nodeok között
- Animated data flow (particles mozognak a vonalon)
- Színkód:
  - Zöld = aktív, healthy
  - Piros = probléma (demo esetén)
  - Kék = VPN kapcsolat

#### Interakció
- **Orbit Controls:** egér drag → forgat
- **Hover:** Node highlight + tooltip
- **Click:** Node details panel (IP, status, config snippet)
- **Auto-rotation:** Lassú forgás alapból (kikapcsolható)

#### Responsive Stratégia

| Képernyő | Megoldás |
|----------|----------|
| **Desktop (>1024px)** | Teljes 3D scene, interactive |
| **Tablet (768-1024px)** | Egyszerűsített 3D (kevesebb node) |
| **Mobile (<768px)** | **Fallback:** 2D animated SVG vagy statikus illusztráció |

### Performance Optimalizálás
- **Lazy loading:** Three.js csak akkor töltődik, ha a section látható (Intersection Observer)
- **LOD (Level of Detail):** Távolról egyszerűbb geometria
- **Instancing:** Azonos objektumok (pl. workstations) egy mesh
- **Frame rate limiting:** Max 30 FPS mobilon

---

## 📝 Implementációs Lépések

### Fázis 1: Setup & Alap 3D Scene (1-2 nap)

**1.1 Dependenciák telepítése**
```bash
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

**1.2 Alap komponens létrehozása**
```
src/components/3d/NetworkVisualization.tsx
src/components/sections/network-hero.tsx
```

**1.3 Statikus scene renderelése**
- Canvas setup
- Camera pozícionálás
- Lighting (ambient + directional)
- Alap geometria (1 router node)

**Ellenőrzés:** Látszik egy forgó narancssárga gömb

---

### Fázis 2: Teljes Network Graph (2-3 nap)

**2.1 Node-ok létrehozása**
```tsx
// Példa node struktúra
const nodes = [
  { id: 'router', type: 'router', position: [0, 0, 0], label: 'Core Router' },
  { id: 'switch1', type: 'switch', position: [3, 1, 0], label: 'Switch 1' },
  // ...
]
```

**2.2 Edge-ek (kapcsolatok) megrajzolása**
- Line geometry két node között
- Animated shader (data flow effect)

**2.3 Interaktivitás**
- OrbitControls hozzáadása
- Hover detection (raycasting)
- Tooltip component

**Ellenőrzés:** Teljes hálózati graph látható, forgatható

---

### Fázis 3: UI Integráció & Refinement (2-3 nap)

**3.1 NetworkHero komponens**
- 3D Visualization bal oldalon (60% szélesség)
- Szöveges tartalom jobb oldalon (40%)
- Responsive layout

**3.2 Controls Panel**
- "Auto-rotate" toggle
- "Simulate Attack" gomb → firewall blokkol egy kapcsolatot
- "Reset View" gomb

**3.3 Mobile Fallback**
- 2D SVG vagy Lottie animáció készítése
- Conditional rendering breakpoint alapján

**Ellenőrzés:** Működik minden eszközön, smooth

---

### Fázis 4: Tartalom & Fordítások (1 nap)

**4.1 Új fordítási kulcsok**
```json
// messages/hu.json
"Services": {
  "Network": {
    "hero_title": "Professzionális Hálózati Megoldások",
    "hero_desc": "...",
    "3d_controls": {
      "rotate": "Automatikus forgatás",
      "simulate": "Támadás szimulálása",
      "reset": "Nézet visszaállítása"
    },
    "services": {
      "vpn": { ... },
      "vlan": { ... },
      "firewall": { ... },
      "wifi": { ... }
    }
  }
}
```

**4.2 NetworkServicesGrid komponens**
- 4 kártya: VPN, VLAN, Firewall, WiFi
- Ikonok, leírások, feature listák

---

### Fázis 5: Use Cases & Pricing (1 nap)

**5.1 Network-specific use cases**
- "Remote Office VPN Setup"
- "Guest Network Isolation (VLAN)"
- "DDoS Mitigation (Firewall)"

**5.2 Network Pricing Calculator**
- Input: Helyszínek száma, eszközök száma
- Output: Becsült havi díj + one-time setup fee

**5.3 Case Study integráció**
- A már meglévő "KKV Infrastruktúra Modernizáció" kiemelése
- Vagy új, hálózat-fókuszú case study

---

### Fázis 6: Testing & Launch (1 nap)

**6.1 Cross-browser testing**
- Chrome, Firefox, Safari, Edge
- Mobile: iOS Safari, Android Chrome

**6.2 Performance audit**
- Lighthouse score > 90
- 3D scene FPS > 30 (desktop), > 20 (mobile fallback)

**6.3 SEO**
- Meta tags, OG image
- Schema.org markup (Service type)

**6.4 Deploy**
- Vercel preview deployment
- Ha OK, production merge

---

## 📅 Ütemterv

| Fázis | Időtartam | Kezdés | Befejezés |
|-------|-----------|--------|-----------|
| **1. Setup & Alap 3D** | 1-2 nap | 2026.01.23 | 2026.01.24 |
| **2. Network Graph** | 2-3 nap | 2026.01.25 | 2026.01.27 |
| **3. UI Integráció** | 2-3 nap | 2026.01.28 | 2026.01.30 |
| **4. Tartalom** | 1 nap | 2026.01.31 | 2026.01.31 |
| **5. Use Cases** | 1 nap | 2026.02.01 | 2026.02.01 |
| **6. Testing** | 1 nap | 2026.02.02 | 2026.02.02 |
| **🚀 Launch** | - | - | **2026.02.03** |

**Becsült összes idő:** **8-11 munkanap** (~2-3 hét)

---

## 💰 Várható ROI

### Költségek
- **Fejlesztői idő:** 80-110 óra × 15.000 Ft/óra = **1.2M - 1.65M Ft**
- **Hosting:** +0 Ft (ugyanaz a Vercel tier)
- **Összesen:** **~1.5M Ft**

### Bevétel (konzervatív becslés)
- **Jelenlegi:** ~2 hálózati projekt/év @ 500k Ft átlag = **1M Ft/év**
- **3D viz után:** ~5 projekt/év @ 700k Ft átlag = **3.5M Ft/év**
- **Növekmény:** **+2.5M Ft/év**

**Megtérülés:** **~7 hónap** 🎯

---

## 🎨 Design Mockup Leírás

### Hero Section
```
┌─────────────────────────────────────────────────────┐
│  [3D Network Viz]       │  Professzionális        │
│  ┌──────────────┐       │  Hálózati Megoldások    │
│  │   🌐         │       │                          │
│  │  /│\  ·····  │       │  Biztonságos távoli     │
│  │ ◉─◉─◉        │       │  elérés, szegmentált    │
│  │  \ │/        │       │  hálózat, tűzfal...     │
│  └──────────────┘       │                          │
│  [Auto-rotate] [Attack] │  [Ajánlatkérés] [Demo]  │
└─────────────────────────────────────────────────────┘
```

### Services Grid (2x2)
```
┌─────────────┬─────────────┐
│ 🔒 VPN      │ 🔀 VLAN     │
│ Remote      │ Network     │
│ Access      │ Isolation   │
└─────────────┴─────────────┘
┌─────────────┬─────────────┐
│ 🛡️ Firewall │ 📡 WiFi     │
│ Security    │ Management  │
└─────────────┴─────────────┘
```

---

## 🔧 Technikai Kockázatok & Mitigáció

| Kockázat | Valószínűség | Impact | Mitigáció |
|----------|--------------|--------|-----------|
| **3D túl lassú mobilon** | Közepes | Nagy | 2D fallback, lazy load |
| **Three.js bundle size nagy** | Alacsony | Közepes | Dynamic import, code splitting |
| **Browser kompatibilitás** | Alacsony | Nagy | WebGL detection + fallback |
| **SEO penalizáció (JS heavy)** | Alacsony | Nagy | SSR content, proper meta tags |

---

## 📈 Siker Metrikák

### Mérhető KPI-k (Launch után 3 hónapban)

1. **Engagement:**
   - Átlagos oldal töltési idő > 2 perc (jelenlegi: ~45 sec)
   - 3D interaction rate > 30%

2. **Konverzió:**
   - Lead form submission +20%
   - Hálózati projektek +150% (2 → 5)

3. **SEO:**
   - "hálózat kiépítés" top 5 Google
   - "VPN telepítés" top 3 Google

4. **Performance:**
   - Lighthouse score > 90
   - FPS > 30 desktop, > 20 mobile

---

## ✅ Validációs Checklist (Launch előtt)

- [ ] 3D scene renderel minden modern böngészőben
- [ ] Mobile fallback működik (2D)
- [ ] Hover tooltips láthatók
- [ ] Auto-rotation toggle működik
- [ ] "Simulate Attack" animáció lefut
- [ ] Fordítások (HU/EN) teljesek
- [ ] SEO meta tags helyesek
- [ ] OG image generálva
- [ ] Lighthouse score > 90
- [ ] Cross-browser tesztelve (Chrome, Firefox, Safari, Edge)
- [ ] Mobile tesztelve (iOS, Android)
- [ ] Accessibility: keyboard navigation + screen reader support
- [ ] Analytics tracking beállítva (3D interakciókra)
- [ ] Vercel Preview deployment sikeres
- [ ] Client review OK

---

## 🚀 Go-Live Plan

### Pre-Launch (T-1 nap)
- [ ] Staging environment teljes teszt
- [ ] Performance audit
- [ ] Tartalmi review (copywriting check)

### Launch Day (T=0)
- [ ] Production deploy (reggel 9:00)
- [ ] Monitoring aktív (Sentry, Vercel Analytics)
- [ ] Social media announcement (LinkedIn, Facebook)
- [ ] Email blast meglévő ügyfeleknek
- [ ] Blog post: "Új interaktív hálózati vizualizáció"

### Post-Launch (T+1-7 nap)
- [ ] Napi analytics review
- [ ] User feedback gyűjtése
- [ ] Hotfix deploy ha szükséges
- [ ] A/B teszt (3D vs 2D) konverziós különbségekre

---

## 📚 Referenciák & Inspiráció

### Példák más cégektől:
1. **Cloudflare Network Map** - Élő global network viz
2. **Cisco Packet Tracer** - Network simulation
3. **AWS Architecture Diagrams** - Clean icon-based

### Design példák:
- **awwwards.com** - Showcase oldalak 3D-vel
- **threejs.org/examples** - Technikai példák

---

## 📞 Kapcsolat & Support

**Kérdések / Problémák esetén:**
- Slack: #fejlesztes-halozat
- Email: dev@backlineit.hu
- Daily standup: 9:00 (CET)

**Döntéshozók:**
- Product Owner: Török Norbert
- Tech Lead: Török Norbert
- Designer: Nagy Anna

---

**Dokumentum verzió:** 1.0  
**Utolsó frissítés:** 2026. 01. 22. 18:30  
**Következő review:** 2026. 01. 23. reggel

---

## ✨ Következő Lépések (Holnapra)

1. **Decision:** Go/No-Go a 3D hálózati vizualizációra
2. **Ha Go:**
   - [ ] Three.js package-ek telepítése
   - [ ] Alap 3D scene létrehozása (1 router node)
   - [ ] NetworkHero komponens vázának elkészítése
3. **Ha No-Go:**
   - [ ] Alternatív megoldás: 2D animated SVG vagy Lottie
   - [ ] Vagy: Dedikált hálózati oldal 3D nélkül

**Státusz update:** Reggel 9:00 - döntés + kickoff meeting

🚀 **Készen állunk az indulásra!**
