# 📘 Értékesítői Kézikönyv és Tudásbázis

Ez a dokumentum az új sales kollégák számára készült. Részletesen bemutatja a céget, a termékeket, a szolgáltatásokat és a technológiai hátteret, hogy magabiztosan tudjanak tárgyalni az ügyfelekkel.

---

## 🚀 Mivel foglalkozunk? (Elevator Pitch)

Mi nem csak egy webfejlesztő cég vagyunk. **Komplex digitális megoldásokat szállítunk**, amelyek automatizálják és felgyorsítják a vállalkozások működését. A modern webes jelenlétet (Next.js) ötvözzük a háttérfolyamatok automatizálásával (n8n), így az ügyfél nem csak egy szép weboldalt kap, hanem egy "önműködő" rendszert.

**Fő fókuszunk:**
1.  **Egyedi webalkalmazások** (nem sima WordPress oldalak).
2.  **Üzleti folyamat automatizálás** (n8n workflow-k).
3.  **Digitális termékek** (kész pluginok és scriptek).

---

## 🛠️ Szolgáltatások (Amit építünk)

Ezeket a szolgáltatásokat kínáljuk testreszabottan ügyfeleknek.

### 1. Webfejlesztés (Next.js)
*   **Mi ez?**: Prémium minőségű, villámgyors weboldalak és webalkalmazások.
*   **Miért jobb, mint a konkurencia?**: A legmodernebb **Next.js** keretrendszert használjuk (amit a Netflix, TikTok, Notion is).
    *   🚀 **Sebesség**: Az oldalak azonnal betöltődnek.
    *   🔒 **Biztonság**: Nem törhető fel úgy, mint egy elavult WordPress.
    *   📱 **Reszponzív**: Mobilon is tökéletes élmény.

### 2. Automatizáció (n8n)
*   **Mi ez?**: "Összekötünk mindent mindennel". Ha van egy unalmas, ismétlődő feladat (pl. számlázás, adatgépelés, email válaszok), mi szoftverrobotokat építünk rá.
*   **Technológia**: **n8n** (workflow automation tool).
*   **Példák**:
    *   Bejövő lead -> CRM mentés -> Slack értesítés -> Automata email.
    *   Megrendelés -> Számla kiállítás -> Futár rendelés.

### 3. Rendszerüzemeltetés (DevOps)
*   **Mi ez?**: Gondoskodunk róla, hogy az ügyfél rendszerei 0-24 órában elérhetőek legyenek.
*   **Kulcsszavak**: Cloud szolgáltatások, Server monitoring, Backup.

---

## 📦 Termékek (Amit készen árulunk)

Ezek "dobozos" szoftverek, amiket a weboldalunkon (Webshop) azonnal megvehetnek. Fontos ismerni őket az upsell miatt.

| Termék Név | Kategória | Mire jó? (Sales duma) |
| :--- | :--- | :--- |
| **WooCommerce Számlázz.hu Integráció** | WordPress Plugin | "Teljesen automatizálja a számlázást a webshopjában. Kezeli a sztornókat és az előlegszámlákat is, amivel heti több óra adminisztrációt spórol." |
| **n8n Lead Management Workflow** | Automatizáció | "Ha bejön egy érdeklődő, ez a robot azonnal leellenőrzi az email címét, kikutatja a cég adatait, és berakja a CRM-be. Így csak a valódi potenciális vevőkkel kell foglalkozni." |
| **Python Web Scraper Starter Kit** | Script | "Adatgyűjtéshez alapcsomag. Ha versenytársakat akar figyelni vagy árakat összehasonlítani, ezzel a scripttel azonnal kezdhet." |
| **Biztonsági Audit Checklist** | E-book | "100+ pontos ellenőrzőlista, hogy biztosan ne törjék fel az oldalát. Olyan, mint egy műszaki vizsga a weboldalnak." |
| **Next.js SaaS Boilerplate** | Template | "Ha saját szoftver startupot indítana, ezzel hónapokat spórolhat. Benne van a fizetés, beléptetés, admin felület – csak az ötletet kell hozzáadni." |

---

## ⚙️ Technológiai Háttér (A "Motorháztető" Alatt)

Ezek azok a technikai részletek, amikkel le lehet nyűgözni a technológiai vezetőket (CTO) vagy hozzáértő ügyfeleket.

### 1. Email Rendszer: **Cloudflare Workers**
*   **A probléma**: A hagyományos emailszerverek lassúak, gyakran spambe kerülnek, vagy nehéz őket skálázni.
*   **A mi megoldásunk**: Az email forgalmat a **Cloudflare Workers** (serverless kód) kezeli.
*   **Előny**:
    *   **Villámgyors**: A világ 300+ pontjáról fut, mindig a felhasználóhoz legközelebb.
    *   **Megbízható**: 99.99% rendelkezésre állás.
    *   **Programozható**: Minden bejövő emailt azonnal elemzünk, és eldöntjük, mi történjen vele (pl. továbbítás n8n-nek ticket nyitáshoz).

### 2. Agyközpont: **n8n Integráció**
*   Az oldalunk nem csak egy "kirakat". Mélyen integrálva van az **n8n** rendszerrel.
*   **Hogyan működik nálunk?**:
    *   Ha valaki **Ticketet nyit** -> Az API hív egy n8n webhookot -> Az n8n értesíti az admint és visszaigazoló emailt küld.
    *   Ha valaki **Hírlevélre iratkozik** -> Az n8n beleteszi az adatbázisba és kiküldi az üdvözlő ajándékot.
    *   **Feedback**: A visszajelzések elemzése is automatizáltan történik AI segítségével.

### 3. Adatbázis: **Neon (Serverless Postgres)**
*   Az adatait biztonságos, felhő alapú adatbázisban tároljuk, ami automatikusan skálázódik a terheléshez.

---

## 💼 Értékesítési Folyamat Tippek

1.  **Figyelj a fájdalompontokra!**
    *   "Sok idő megy el az adminisztrációval?" -> **Ajánld az n8n automatizációt.**
    *   "Lassú a mostani weboldal, nehéz bővíteni?" -> **Ajánld a Next.js fejlesztést.**
    *   "Szeretne saját szoftvert árulni?" -> **Ajánld a SaaS Boilerplate-et.**

2.  **Demoztasd a Dashboardot!**
    *   Mutasd meg az Ügyfélportált, ahol látják a licenceiket. Ez bizalmat épít, hogy profi rendszerünk van.

3.  **Hangsúlyozd a Biztonságot!**
    *   Webshopoknál és céges rendszereknél kritikus. Említsd meg a Cloudflare védelmet és a biztonsági audit szolgáltatásunkat.

---

## ❓ Gyakori Kérdések (FAQ)

*   **Q: Miért drágább ez, mint egy Wix/WordPress oldal?**
    *   A: Mert ez egy egyedi szoftver, ami pontosan az Ön igényeire van szabva, gyorsabb, biztonságosabb és automatizált. Hosszú távon olcsóbb, mert nem kell folyamatosan foltozgatni és élő munkaerővel adminisztrálni.
*   **Q: Tudtok szerződést írni?**
    *   A: Igen, egyedi fejlesztéseknél mindig SLA (Service Level Agreement) szerződést kötünk.
*   **Q: Garancia?**
    *   A: A "dobozos" termékeinkre pénzvisszafizetési garancia van (hibás működés esetén), az egyedi fejlesztésekre pedig szavatosságot vállalunk.

---
---

## 🤖 10 További Automatizálási Ötlet (Upsell lehetőségek)

Ezek a konkrét, üzleti értékkel bíró folyamatok, amiket megépíthetünk az ügyfeleknek n8n-ben.

1.  **Automata Ajánlatkészítő Rendszer**
    *   **Folyamat**: Az ügyfél kitölt egy űrlapot (Typeform) -> n8n generál egy PDF árajánlatot a Google Docs sablon alapján -> Elküldi emailben a vevőnek.
    *   **Előny**: Azonnali árajánlat adás emberi beavatkozás nélkül.

2.  **Szerződéskötés & Onboarding**
    *   **Folyamat**: Új ügyfél "Elfogadom" gombra kattint -> n8n létrehozza a szerződést (DocuSign/HelloSign) -> Kiküldi aláírásra -> Aláírás után létrehozza a projektet a Trello/Jira-ban és a Slack csatornát.
    *   **Előny**: Zéró adminisztráció új ügyfél beléptetésekor.

3.  **Versenytárs Árfigyelő (Price Monitor)**
    *   **Folyamat**: Minden reggel lefut egy scraper -> Megnézi a konkurencia árait -> Ha valaki olcsóbb, Slack értesítést küld a menedzsmentnek.
    *   **Előny**: Mindig versenyképes árazás.

4.  **Közösségi Média Robot (Social Media Auto-poster)**
    *   **Folyamat**: Új blogbejegyzés élesedik a WordPressen -> n8n beküldi a szöveget a ChatGPT-nek -> Generál belőle poszt szöveget LinkedInre, Facebookra és Twitterre -> Időzíti a posztokat.
    *   **Előny**: Egy tartalom, automatikus terjesztés minden platformon.

5.  **Intelligens Ügyfélszolgálat (Sentiment Analysis)**
    *   **Folyamat**: Bejön egy email/ticket -> OpenAI elemzi a hangnemet (dühös/elégedett) -> Ha dühös, azonnal "MAGAS" prioritást kap és SMS-t küld a vezetőnek.
    *   **Előny**: A problémás ügyfelek azonnali kezelése, churn csökkentés.

6.  **Kintlévőség Kezelő (Invoice Chaser)**
    *   **Folyamat**: Számlázó program webhookja (lejárt számla) -> n8n küld egy kedves emlékeztetőt -> 3 nap múlva egy határozottabbat -> 7 nap múlva értesíti a pénzügyet.
    *   **Előny**: Jobb cash-flow, kevesebb kínos telefonálgatás.

7.  **Weboldal & Szerver Őrszem (Uptime Monitor)**
    *   **Folyamat**: 5 percenként ellenőrzi az oldal betöltését -> Ha hiba van (nem 200 OK), azonnal Telegram/SMS üzenetet küld, és megpróbálja újraindítani a szolgálatatást (ssh parancs).
    *   **Előny**: Minimalizált leállás, azonnali reakció.

8.  **Automata Riportolás (Reporting)**
    *   **Folyamat**: Hónap elsején lekéri az adatokat (Google Analytics, Stripe, CRM) -> Összefűzi egy szép PDF riportba -> Elküldi az ügyvezetőnek emailben.
    *   **Előny**: Tiszta kép a cég teljesítményéről manuális Excel táblázatok nélkül.

9.  **Lead Gazdagítás (Enrichment)**
    *   **Folyamat**: Valaki feliratkozik csak egy email címmel -> n8n keres a Clearbit/Apollo adatbázisban -> Megtalálja a nevet, céget, LinkedIn profilt -> Bemásolja a CRM-be.
    *   **Előny**: A sales csapat sokkal több infót kap a leadről, mielőtt felhívná.

10. **Automatikus Véleménykérő (Review Requester)**
    *   **Folyamat**: Projekt lezárása / Termék kiszállítása után 7 nappal -> n8n küld egy személyes hangvételű emailt Google Review linkkel -> Ha ad 5 csillagot, küld egy "Köszönöm" kupont.
    *   **Előny**: Több pozitív értékelés, jobb SEO és hírnév.

---
*Készítette: IT Services Development Team - 2025*
