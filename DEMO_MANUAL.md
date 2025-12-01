# Weboldal Bemutató és Tesztelési Kézikönyv

Ez a dokumentum részletes útmutatót nyújt a weboldal funkcióinak és felületének bemutatásához. Használd ezt a sorvezetőt, amikor kollégáknak vagy ügyfeleknek prezentálod az oldalt.

## 1. Globális Felületi Elemek (Global UI)
Ezek az elemek az oldal minden pontján elérhetőek, így érdemes ezekkel kezdeni a bemutatót.

### Fejléc (Header)
- **Navigáció**: Ellenőrizd a menüpontokat (Szolgáltatások, Scriptek, Webfejlesztés, stb.). Hover effektusok működése.
- **Sticky Működés**: Görgess lejjebb, a fejlécnek rögzítve kell maradnia, enyhe áttetszőséggel (glassmorphism).
- **Kosár (Cart Drawer)**: Kattints a kosár ikonra. Jobbról be kell úsznia a kosár panelnek. (Üres állapot / Termékekkel teli állapot).
- **Mobil Menü**: Mobil nézetben (vagy kis ablakméretnél) ellenőrizd a hamburger menü működését.

### ÚJ: Globális Kereső (Command Palette)
- **Aktiválás**: Nyomd meg a `Ctrl+K` (vagy Mac-en `Cmd+K`) billentyűkombinációt.
- **Működés**: Írj be keresőszavakat (pl. "blog", "kapcsolat").
- **Navigáció**: A nyilakkal vagy egérrel válassz ki egy találatot, és nyomj Entert az odaugráshoz.

### ÚJ: Vissza a Tetejére Gomb
- **Megjelenés**: Görgess le az oldal közepéig. A jobb alsó sarokban meg kell jelennie egy nyíl ikonnak.
- **Működés**: Kattints rá, az oldalnak simán (smooth scroll) vissza kell görnie a tetejére.

## 2. Főoldal (Home)
A látogatók belépési pontja.

- **Hero Szekció**: Ellenőrizd a főcímet, a leírást és a CTA gombokat ("Árak megtekintése", "Szolgáltatások").
- **Szolgáltatások Előnézet**: Kártyák a főbb szolgáltatásokkal. Hover effektek, kattintásra a megfelelő aloldalra visznek.
- **Miért válassz minket**: Statisztikai kártyák (5+ év, 50+ projekt).
- **Folyamat**: A 4 lépéses munkafolyamat bemutatása.
- **Lead Magnet**: Hírlevél feliratkozó vagy ingyenes anyag letöltő szekció (ha aktív).

## 3. Szolgáltatások
A fő üzleti ajánlatok részletezése.

- **Főoldal (/szolgaltatasok)**: Gyűjtőoldal az összes szolgáltatással.
- **Aloldalak**:
    - **Webfejlesztés**: Reszponzív design, technológiák bemutatása.
    - **Egyedi Scriptek**: Automatizációs megoldások.
    - **Rendszerüzemeltetés**: Szerverek, DevOps.
    - **Kiberbiztonság**: Audit, védelem.
- **ÚJ: Breadcrumbs (Morzsamenü)**: Bármelyik aloldalon (pl. `/szolgaltatasok/webfejlesztes`) ellenőrizd a fejléc alatt a navigációs utat: `Főoldal > Szolgáltatások > Webfejlesztés`. Kattints a köztes elemekre a visszalépéshez.

## 4. E-commerce Funkciók (Termékek & Vásárlás)
A digitális termékek értékesítési folyamata.

- **Termékek Lista (/termekek)**:
    - Termékkártyák megjelenése.
    - Szűrési lehetőségek (ha vannak).
    - "Részletek" gomb működése.
- **Termék Részletek (/termekek/[slug])**:
    - **Licenc Választó**: Válts a Personal / Commercial / Developer licencek között. Az árnak dinamikusan frissülnie kell.
    - **Kosárba rakás**: Kattints a gombra. A kosár panelnek meg kell nyílnia a hozzáadott termékkel.
- **Pénztár (/checkout)**:
    - Kosár tartalmának ellenőrzése.
    - Űrlap kitöltése (szimulált).
    - Fizetési mód választás.

## 5. Tartalmi Oldalak
Információs oldalak a bizalomépítéshez.

- **Blog (/blog)**: Cikkek listázása, kategóriák. Egy cikk megnyitása.
- **Referenciák (/referenciak)**: Korábbi munkák bemutatása.
- **Rólunk (/rolunk)**: Csapat bemutatása, cégtörténet.
- **Kapcsolat (/kapcsolat)**: Űrlap működése, elérhetőségek, térkép.
- **Árak (/arak)**: Összehasonlító táblázatok, csomagajánlatok.

## 6. Ügyfélportál (User Portal)
A regisztrált felhasználók felülete.

- **Bejelentkezés (/login)**:
    - Login űrlap megjelenése.
    - "Bejelentkezés GitHub-bal" gomb (OAuth).
- **Vezérlőpult (/dashboard)**:
    - **Áttekintés**: Aktív licencek, legutóbbi rendelések.
    - **Vásárlások**: Korábbi tranzakciók listája.
    - **Licencek**: Szoftver licencek kezelése, letöltése.
- **Admin Felület (/admin)**: (Csak admin jogosultsággal)
    - Felhasználók kezelése.
    - Rendelések áttekintése.

## 7. Jogi Oldalak (Footer)
A láblécben található kötelező oldalak.

- **Adatvédelem**: GDPR tájékoztató.
- **ÁSZF**: Általános Szerződési Feltételek.
- **Impresszum**: Cégadatok.

## 8. Multilingual Support (i18n)
- **Nyelvváltás**:
    -   Írd át manuálisan az URL-t `/hu`-ról `/en`-re (vagy fordítva).
    -   Ellenőrizd, hogy a Főoldal tartalma (címsor, leírás, gombok) angolra vált-e.
    -   Kattints a navigációs linkekre, és ellenőrizd, hogy a nyelv megmarad-e.
- **Auth & Routing**:
    -   Jelentkezz be, és figyeld meg, hogy a visszairányításnál megmarad-e a választott nyelv (pl. `/en/dashboard`).

## Tesztelési Ellenőrzőlista (Checklist)

- [ ] **Reszponzivitás**: Mobilon, tableten és desktopon is minden olvasható és kattintható?
- [ ] **Navigáció**: Minden link működik, nincsenek 404-es hibák?
- [ ] **Sebesség**: Az oldalak gyorsan betöltődnek? (Skeleton loading látszik?)
- [ ] **Interakciók**: Gombok, hover effektek, animációk simák?
- [ ] **Helyesírás**: Nincsenek elgépelések vagy helytelen kifejezések?
- [ ] **Téma**: A sötét téma (Dark Mode) színei kontrasztosak és olvashatóak?
