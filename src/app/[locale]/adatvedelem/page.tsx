import { LegalLayout } from "@/components/layout/legal-layout"
import { DataControls } from "@/components/privacy/data-controls"

export default function AdatvedelemPage() {
    return (
        <LegalLayout title="Adatvédelmi Tájékoztató" lastUpdated="2024. január 1.">
            <p className="lead">
                Az BacklineIT Kft. elkötelezett az Ön személyes adatainak védelme mellett.
                Jelen tájékoztató célja, hogy világos és átlátható információt nyújtson arról, hogyan kezeljük adatait a GDPR (Általános Adatvédelmi Rendelet) előírásaival összhangban.
            </p>

            <h2>1. Az Adatkezelő</h2>
            <p>
                Az adatok kezelője az BacklineIT Kft. (székhely: 1138 Budapest, Váci út 123., email: info@itservices.hu).
                Cégünk felelős az Ön által megadott személyes adatok jogszerű, tisztességes és átlátható kezeléséért.
            </p>

            <h2>2. Milyen adatokat gyűjtünk?</h2>
            <p>A szolgáltatásaink igénybevétele során az alábbi adatokat kezelhetjük:</p>
            <ul>
                <li><strong>Kapcsolattartási adatok:</strong> Név, email cím, telefonszám (pl. kapcsolatfelvételkor vagy regisztrációkor).</li>
                <li><strong>Számlázási adatok:</strong> Számlázási név, cím, adószám (vásárlás esetén).</li>
                <li><strong>Technikai adatok:</strong> IP cím, böngésző típusa, eszköz adatok (a weboldal biztonságos működése érdekében).</li>
                <li><strong>Cookie-k (sütik):</strong> A felhasználói élmény javítása és statisztikai célokból. Részletes tájékoztatás a Cookie Szabályzatban (lásd lentebb).</li>
            </ul>

            <h2>3. Cookie (Süti) Tájékoztató</h2>
            <p>
                Weboldalunk a megfelelő működés, a felhasználói élmény javítása, valamint statisztikai és marketing célokból sütiket (cookie-kat) használ.
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Munkamenet sütik (szükséges):</strong> Ezek elengedhetetlenek a weboldal navigációjához és funkcióinak használatához.</li>
                <li><strong>Statisztikai sütik:</strong> Segítenek megérteni, hogyan használják látogatóink a weboldalt (pl. Google Analytics). Ezek az adatok anonimizáltak.</li>
                <li><strong>Marketing sütik:</strong> Célzott hirdetések megjelenítésére szolgálnak.</li>
            </ul>
            <p>
                A weboldal első látogatásakor a Cookie Banner segítségével nyilatkozhat a nem szükséges sütik elfogadásáról vagy elutasításáról.
                Beállításait később bármikor módosíthatja a böngészőjében vagy a weboldal láblécében található beállításoknál.
            </p>

            <h2>3. Az adatkezelés célja és jogalapja</h2>
            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-muted/50 font-semibold">
                        <tr>
                            <th className="p-3">Adatkezelés célja</th>
                            <th className="p-3">Jogalap</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        <tr>
                            <td className="p-3">Szolgáltatás nyújtása, szerződés teljesítése</td>
                            <td className="p-3">Szerződés teljesítése (GDPR 6. cikk (1) b))</td>
                        </tr>
                        <tr>
                            <td className="p-3">Számlázás és könyvelés</td>
                            <td className="p-3">Jogi kötelezettség teljesítése (GDPR 6. cikk (1) c))</td>
                        </tr>
                        <tr>
                            <td className="p-3">Kapcsolattartás, ügyfélszolgálat</td>
                            <td className="p-3">Jogos érdek (GDPR 6. cikk (1) f))</td>
                        </tr>
                        <tr>
                            <td className="p-3">Hírlevél küldés</td>
                            <td className="p-3">Az Ön hozzájárulása (GDPR 6. cikk (1) a))</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>4. Adattovábbítás</h2>
            <p>
                Adatait harmadik félnek csak a szolgáltatás teljesítése érdekében vagy jogszabályi kötelezettség esetén továbbítjuk.
                Partnereink (adatfeldolgozók):
            </p>
            <ul>
                <li><strong>Tárhelyszolgáltató:</strong> Vercel Inc.</li>
                <li><strong>Fizetési szolgáltató:</strong> OTP Mobil Kft. (SimplePay), Stripe Inc.</li>
                <li><strong>Könyvelés:</strong> [Könyvelőiroda Neve]</li>
            </ul>

            <h2>5. Az adatok tárolásának időtartama</h2>
            <p>
                A személyes adatokat csak addig tároljuk, amíg az adatkezelés célja megvalósul, vagy amíg jogszabály (pl. számviteli törvény) kötelezővé teszi.
                A számlázási adatokat a törvény értelmében 8 évig őrizzük meg.
            </p>

            <h2>6. Az Ön jogai</h2>
            <p>
                A GDPR alapján Ön jogosult:
            </p>
            <ul>
                <li><strong>Hozzáféréshez:</strong> Tájékoztatást kérhet a kezelt adatairól.</li>
                <li><strong>Helyesbítéshez:</strong> Kérheti pontatlan adatainak javítását.</li>
                <li><strong>Törléshez (&quot;elfeledtetéshez&quot;):</strong> Kérheti adatai törlését, ha az adatkezelésnek nincs más jogalapja.</li>
                <li><strong>Adathordozhatósághoz:</strong> Kérheti adatai átadását tagolt, géppel olvasható formátumban.</li>
                <li><strong>Tiltakozáshoz:</strong> Tiltakozhat a jogos érdeken alapuló adatkezelés ellen.</li>
            </ul>
            <p>
                Jogainak gyakorlásához kérjük, vegye fel velünk a kapcsolatot az <a href="mailto:info@itservices.hu">info@itservices.hu</a> címen.
            </p>

            <h2>7. Jogorvoslati lehetőségek</h2>
            <p>
                Panaszával a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH) fordulhat (1055 Budapest, Falk Miksa utca 9-11., www.naih.hu),
                vagy bírósághoz fordulhat.
            </p>

            <h2>8. Adatkezelési Eszközök</h2>
            <p>
                Bejelentkezett felhasználóként itt kezelheti a fiókjához tartozó adatokat.
            </p>
            <div className="mt-6 not-prose">
                <DataControls />
            </div>
        </LegalLayout>
    )
}
