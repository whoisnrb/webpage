# Implementációs Terv: Informatikai Rendszer- és Hálózatüzemeltetési Szolgáltatások

Ez a dokumentum összefoglalja a javasolt stratégiai és technikai lépéseket az új hálózati és rendszerüzemeltetési szolgáltatások beépítéséhez a BacklineIT portfóliójába.

---

## 1. Szolgáltatási Portfólió Kiterjesztése

Mivel az informatikai rendszer- és hálózatüzemeltetői szakképesítés erős technikai hitelességet ad, az alábbi négy pillérre javasolt bontanunk a szolgáltatást:

### A. Virtualizáció és Felhő Megoldások (IaaS)
*   **Proxmox / VMware / Hyper-V**: Meglévő fizikai szerverek virtualizálása a költséghatékonyság és rugalmasság érdekében.
*   **Konténerizáció**: Docker és Kubernetes alapú környezetek kialakítása fejlesztői csapatoknak.
*   **Erőforrás optimalizálás**: Meglévő infrastruktúra átvilágítása és teljesítmény-hangolása.

### B. Professzionális Hálózati Megoldások
*   **Biztonságos távoli elérés (VPN)**: WireGuard vagy OpenVPN alapú vállalati hálózatok kialakítása.
*   **Hálózati szegmentálás (VLAN)**: Az irodai eszközök, szerverek és vendéghálózatok biztonságos elkülönítése.
*   **Tűzfal menedzsment**: MikroTik, Cisco, vagy pfSense eszközök konfigurálása és folyamatos felügyelete.

### C. Szerverüzemeltetés és Karbantartás
*   **Linux/Windows Szerverek**: Telepítés, hardening (biztonsági szigorítás) és folyamatos frissítés.
*   **Active Directory / LDAP**: Központi felhasználókezelés és jogosultságkezelés kialakítása.
*   **Monitoring**: 24/7-es felügyelet (Zabbix/UptimeKuma) automatikus riasztásokkal.

### D. Adatbiztonság és Katasztrófa-helyreállítás
*   **3-2-1 Mentési Stratégia**: Három másolat, két különböző hordozón, egy off-site helyszínen.
*   **Zsarolóvírus elleni védelem**: Immútábilis (módosíthatatlan) mentések és biztonsági mentési protokollok.

---

## 2. Implementációs Fázisok

### I. Fázis: Tartalmi Bővítés (Copywriting & Localization)
*   **Művelet**: Új kulcsok hozzáadása a `hu.json` és `en.json` fájlokhoz a `Services` és `HomePage` szekciókban.
*   **Cél**: Professzionális, de az ügyfél számára is érthető (benefit-oriented) leírások készítése.

### II. Fázis: Dedikált Szolgáltatás Aloldal
*   **Művelet**: Új útvonal létrehozása: `/szolgaltatasok/rendszeruzemeltetes`.
*   **Tartalom**: Részletes technikai specifikációk, használt technológiák (logók), és egy specifikus ajánlatkérő űrlap.

### III. Fázis: Vizuális és Interaktív Elemek
*   **Művelet**: Hálózati topológia-szerű animációk beépítése.
*   **Ikonográfia**: Szerver, Hálózat, Felhő és Biztonság ikonok frissítése prémium szintre (Lucide-react + custom CSS).

### IV. Fázis: Referencia és Trust-building
*   **Művelet**: Egy új esettanulmány készítése a `Referenciák` alá: *"Kkv infrastruktúra modernizáció: Hogyan váltottunk papírról biztonságos privát felhőre."*

---

## 3. Üzleti előnyök (Marketing)

*   **Teljes Stack**: Kihangsúlyozzuk, hogy mi nem csak a weboldalt látjuk, hanem a mögötte lévő infrastruktúrát is (Full Logic Control).
*   **Szakértelem**: A technikus végzettség hivatalos garanciát jelent a megbízhatóságra.
*   **Upsell**: A webfejlesztési ügyfeleknek eladható a szerver hoszting és karbantartási szolgáltatás is.

---

## 4. Javasolt technikai "Stack" a bemutatáshoz
*   **Virtualizáció**: Proxmox, VMware, KVM
*   **Hálózat**: MikroTik, Ubiquiti, pfSense
*   **OS**: Debian, Ubuntu Server, Rocky Linux, Windows Server
*   **Docker**: Docker Compose, Portainer

---
**Készítette:** Szenes István
**Dátum:** 2026. 01. 19.
