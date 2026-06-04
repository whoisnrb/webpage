export interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  date: string;
}

export const reviews: Review[] = [
  {
    id: "rev-1",
    name: "Kovács Péter",
    role: "Ügyvezető, TechSolution Kft.",
    content: "Az AI alapú ügyfélszolgálat, amit a weboldalunkra integráltak, fantasztikus. A látogatóink kérdéseinek 80%-át automatikusan megválaszolja. Hatalmas teher esett le a vállunkról.",
    rating: 5,
    date: "2026-05-15"
  },
  {
    id: "rev-2",
    name: "Nagy Anna",
    role: "E-commerce Manager",
    content: "A webshop mérés és konverziónövelés szolgáltatásuknak köszönhetően a bevételeink jelentősen nőttek. Rendkívül profi adatelemzést végeztek.",
    rating: 5,
    date: "2026-04-20"
  },
  {
    id: "rev-3",
    name: "John Smith",
    role: "CTO, GlobalTech",
    content: "Their cloud migration and cost optimization services saved us thousands of dollars annually. Seamless transition and great communication throughout.",
    rating: 5,
    date: "2026-02-10"
  },
  {
    id: "rev-4",
    name: "Tóth Bence",
    role: "Tulajdonos, WebBolt",
    content: "A webshop automatizáció rengeteg manuális munkától kímélt meg minket. A rendelések feldolgozása most már szinte emberi beavatkozás nélkül történik.",
    rating: 4,
    date: "2025-11-25"
  },
  {
    id: "rev-5",
    name: "Szabó Gábor",
    role: "IT Vezető",
    content: "Az üzleti dashboardok és automatizált riportok teljesen megváltoztatták a döntéshozatalunkat. Végre valós időben látjuk a cég legfontosabb mutatóit.",
    rating: 5,
    date: "2025-09-08"
  },
  {
    id: "rev-6",
    name: "Varga Júlia",
    role: "Projektmenedzser",
    content: "A CRM és Lead automatizáció bevezetése óta sokkal jobban tudjuk követni az érdeklődőket. Nincs több elveszett lead.",
    rating: 5,
    date: "2025-07-12"
  },
  {
    id: "rev-7",
    name: "Emily Davis",
    role: "Operations Director",
    content: "The AI Assistants and Business Automation solutions they implemented transformed our daily operations. We are now working much more efficiently.",
    rating: 5,
    date: "2025-04-30"
  },
  {
    id: "rev-8",
    name: "Farkas László",
    role: "Cégvezető",
    content: "A KKV IT Audit és digitális felmérés rávilágított azokra a hiányosságokra, amikről eddig nem is tudtunk. Nagyon hasznos iránymutatást kaptunk.",
    rating: 4,
    date: "2025-01-14"
  },
  {
    id: "rev-9",
    name: "Kiss Zoltán",
    role: "Alapító",
    content: "A havidíjas rendszergazda szolgáltatásukkal teljes biztonságban tudjuk az IT infrastruktúránkat. Gyorsan reagálnak minden problémára.",
    rating: 5,
    date: "2024-11-03"
  },
  {
    id: "rev-10",
    name: "Horváth Eszter",
    role: "Irodavezető",
    content: "A Microsoft 365 és Google Workspace bevezetése és oktatása tökéletesen zajlott. A csapat sokkal hatékonyabban dolgozik együtt.",
    rating: 5,
    date: "2024-09-19"
  },
  {
    id: "rev-11",
    name: "Michael Johnson",
    role: "Lead Developer",
    content: "Excellent network and security implementation. They secured our entire infrastructure and set up reliable remote access for our global team.",
    rating: 5,
    date: "2024-06-07"
  },
  {
    id: "rev-12",
    name: "Balogh Csaba",
    role: "Logisztikai Vezető",
    content: "A hálózatépítés és rendszerüzemeltetés terén nyújtott szakértelmük kiemelkedő. A raktárunk teljes IT hálózatát ők tervezték és üzemeltetik.",
    rating: 4,
    date: "2024-04-25"
  },
  {
    id: "rev-13",
    name: "Simon Tamás",
    role: "Kreatív Ügynökség Vezető",
    content: "Új weboldalt fejlesztettek számunkra, amely modern, gyors és tökéletesen illeszkedik az arculatunkhoz. Profi webfejlesztő csapat.",
    rating: 5,
    date: "2024-02-15"
  },
  {
    id: "rev-14",
    name: "Németh Orsolya",
    role: "HR Vezető",
    content: "A Remote IT Helpdesk szolgáltatásuk nagy segítség az új kollégák beléptetésénél. Minden IT problémát távolról, percek alatt orvosolnak.",
    rating: 5,
    date: "2023-11-12"
  },
  {
    id: "rev-15",
    name: "Sarah Williams",
    role: "Marketing Manager",
    content: "Their custom automation scripts for our marketing campaigns have saved us countless hours of manual data entry. Fantastic work!",
    rating: 5,
    date: "2023-09-18"
  },
  {
    id: "rev-16",
    name: "Papp István",
    role: "Gyártásvezető",
    content: "A Backup & Adatmentési Stratégia kialakítása nyugalmat adott nekünk. Tudjuk, hogy egy esetleges hiba esetén sincsenek veszélyben az adataink.",
    rating: 5,
    date: "2023-06-22"
  },
  {
    id: "rev-17",
    name: "Takács Dávid",
    role: "Webáruház Tulajdonos",
    content: "A WordPress & WooCommerce karbantartást rájuk bíztuk, és azóta nincsenek leállások, az oldal pedig sokkal gyorsabban tölt be.",
    rating: 5,
    date: "2023-03-05"
  },
  {
    id: "rev-18",
    name: "Juhász Kitti",
    role: "Klinika Vezető",
    content: "Biztonsági auditot végeztek nálunk, és számos olyan sebezhetőséget tártak fel, amiket azonnal javítottak is. Maximális megbízhatóság.",
    rating: 4,
    date: "2022-12-20"
  },
  {
    id: "rev-19",
    name: "Mészáros András",
    role: "Pénzügyi Vezető",
    content: "A scriptek és automatizáció területén nyújtott megoldásaikkal a számlázási folyamatainkat tudtuk teljesen automatizálni.",
    rating: 5,
    date: "2022-10-08"
  },
  {
    id: "rev-20",
    name: "David Chen",
    role: "Software Architect",
    content: "We use their managed IT and cloud services. Their responsiveness and deep technical knowledge make them an invaluable partner.",
    rating: 5,
    date: "2022-07-14"
  },
  {
    id: "rev-21",
    name: "Lukács Zsolt",
    role: "Ingatlaniroda Tulajdonos",
    content: "A CRM és Lead automatizáció bevezetése mérföldkő volt a cégünk életében. Sokkal hatékonyabban dolgozunk fel minden megkeresést.",
    rating: 5,
    date: "2022-05-29"
  },
  {
    id: "rev-22",
    name: "Fodor Márton",
    role: "Kiberbiztonsági Szakértő",
    content: "Partnerként dolgozunk együtt hálózati és biztonsági projekteken. Szakmailag rendkívül felkészültek és mindig naprakészek.",
    rating: 5,
    date: "2022-02-11"
  },
  {
    id: "rev-23",
    name: "Gál Edit",
    role: "Rendezvényszervező",
    content: "A felhő migráció zökkenőmentes volt, a szervereink fenntartási költségeit pedig jelentősen csökkenteni tudták.",
    rating: 5,
    date: "2021-11-26"
  },
  {
    id: "rev-24",
    name: "Sipos Gergő",
    role: "Autókereskedő",
    content: "A weboldalunk fejlesztése során minden kérésünket rugalmasan kezelték. Az eredmény egy gyors, reszponzív és modern honlap lett.",
    rating: 4,
    date: "2021-09-09"
  },
  {
    id: "rev-25",
    name: "Robert Taylor",
    role: "IT Consultant",
    content: "Outstanding business dashboards and reporting setup. It gave our management team the clarity they needed to make data-driven decisions.",
    rating: 5,
    date: "2021-07-15"
  },
  {
    id: "rev-26",
    name: "Kerekes Sándor",
    role: "Étteremtulajdonos",
    content: "A havidíjas rendszergazdai szolgáltatásuk révén végre nem nekem kell a számítógépekkel bajlódnom, így a vendégekre fókuszálhatok.",
    rating: 5,
    date: "2021-05-03"
  },
  {
    id: "rev-27",
    name: "Veres Réka",
    role: "Könyvelőiroda Vezető",
    content: "A Microsoft 365 átállást hihetetlen profizmussal menedzselték, a kollégáim gyorsan megtanulták a használatát a segítségükkel.",
    rating: 5,
    date: "2021-03-21"
  },
  {
    id: "rev-28",
    name: "Bognár Tibor",
    role: "Webshop Vezető",
    content: "Webshop automatizációs folyamatainkat rakták rendbe, a készletnyilvántartás és a számlázás végre szinkronban van. Köszönjük!",
    rating: 5,
    date: "2021-02-10"
  },
  {
    id: "rev-29",
    name: "Orosz Melinda",
    role: "Oktatási Központ Vezető",
    content: "A távoli IT helpdesk szolgáltatásuk gyors és megbízható. A tanáraink bármikor fordulhatnak hozzájuk, ha technikai gondjuk akad.",
    rating: 4,
    date: "2021-01-28"
  },
  {
    id: "rev-30",
    name: "Alex Martinez",
    role: "Startup Founder",
    content: "Their AI-powered customer service implementation was a game-changer for our early-stage growth. Exceptional work and support.",
    rating: 5,
    date: "2021-01-15"
  }
];
