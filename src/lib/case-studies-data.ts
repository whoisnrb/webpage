export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  challenge: string;
  solution: string;
  result: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "webshop-optimalizalas",
    title: "Webshop Optimalizálás & Automatizáció",
    client: "GreenLeaf Bio Kft.",
    category: "E-kereskedelem",
    description: "WooCommerce-ről Next.js-re váltás és teljes körű raktárkészlet szinkronizáció, ami 40%-kal növelte a konverziót.",
    tags: ["Next.js", "n8n", "WooCommerce"],
    image: "bg-green-500/10",
    challenge: "A GreenLeaf Bio Kft. régi WooCommerce webshopja lassú volt, és a raktárkészlet gyakran nem egyezett a valósággal, ami vásárlói panaszokhoz vezetett. A manuális rendelésfeldolgozás sok időt vett igénybe.",
    solution: "Egy modern, villámgyors Next.js alapú frontendet fejlesztettünk, miközben a WooCommerce-t megtartottuk backendnek. Bevezettünk egy n8n alapú automatizációt, ami valós időben szinkronizálja a készleteket és automatikusan számláz.",
    result: "Az oldal betöltési sebessége 3 másodpercről 0.8 másodpercre csökkent. A manuális adminisztráció 80%-kal csökkent, a konverziós ráta pedig 40%-kal emelkedett az első 3 hónapban."
  },
  {
    slug: "paciens-kezelo-rendszer",
    title: "Biztonságos Páciens Kezelő Rendszer",
    client: "Praxis Dr. Kovács",
    category: "Egészségügy",
    description: "GDPR-kompatibilis, titkosított páciens adatbázis és időpontfoglaló rendszer privát felhő infrastruktúrán.",
    tags: ["Private Cloud", "Security", "GDPR"],
    image: "bg-blue-500/10",
    challenge: "A praxis papír alapú nyilvántartása és telefonos időpontfoglalása tarthatatlanná vált. Kiemelt fontosságú volt az érzékeny egészségügyi adatok maximális védelme és a GDPR megfelelés.",
    solution: "Egy egyedi, titkosított adatbázissal rendelkező webalkalmazást készítettünk, amely privát felhőben fut. Kétfaktoros hitelesítést (2FA) és audit naplózást vezettünk be minden hozzáféréshez.",
    result: "A recepció terhelése 60%-kal csökkent az online időpontfoglalásnak köszönhetően. Az adatok biztonsága garantált, és a rendszer megfelel minden hatályos jogszabálynak."
  },
  {
    slug: "server-klaszter",
    title: "High-Availability Szerver Klaszter",
    client: "Apex Logistics Zrt.",
    category: "Logisztika",
    description: "0-24 órás rendelkezésre állású szerverpark kiépítése nyomkövető rendszerek számára, 99.99% uptime-mal.",
    tags: ["Linux", "HAProxy", "Monitoring"],
    image: "bg-orange-500/10",
    challenge: "Az Apex Logistics nyomkövető rendszere gyakran leállt terhelés alatt, ami kritikus volt a szállítmányozás szempontjából. A kiesések jelentős anyagi kárt okoztak.",
    solution: "Több csomópontos Kubernetes klasztert építettünk ki automatikus skálázással és HAProxy load balancerrel. Prometheus és Grafana alapú monitoring rendszert telepítettünk a proaktív hibaelhárítás érdekében.",
    result: "A rendszer rendelkezésre állása elérte a 99.99%-ot. A terheléses időszakokban a rendszer automatikusan skálázódik, így nincs lassulás vagy leállás."
  },
  {
    slug: "kkv-infrastruktura-modernizacio",
    title: "KKV Infrastruktúra Modernizáció",
    client: "TechVenture Kft.",
    category: "IT Infrastruktúra",
    description: "Papír alapú folyamatokról biztonságos privát felhőre való átállás, teljes hálózati infrastruktúra átépítéssel.",
    tags: ["Proxmox", "WireGuard VPN", "VLAN", "Zabbix"],
    image: "bg-purple-500/10",
    challenge: "A TechVenture Kft. 15 fős csapata elavult, helyi szervereken dolgozott. A távelérés bizonytalan volt, az adatok mentése manuális, a hálózat szegmentálása nem létezett. A COVID alatt a home office lehetetlenné vált.",
    solution: "Proxmox alapú privát felhőt építettünk ki, WireGuard VPN-nel a biztonságos táveléréshez. VLAN-okkal szegmentáltuk a hálózatot (iroda, vendég, szerverek). Automatikus mentési stratégiát (3-2-1) vezettünk be, és 24/7 monitoring rendszert (Zabbix) telepítettünk.",
    result: "A csapat bárhonnan, biztonságosan tud dolgozni. Az adatvesztés kockázata nullára csökkent, a rendszer rendelkezésre állása 99.9%. A havi IT költség 30%-kal csökkent, miközben a teljesítmény duplájára nőtt."
  }
];
