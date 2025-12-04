import { LegalLayout } from "@/components/layout/legal-layout"

export default function AszfPage() {
    return (
        <LegalLayout title="Általános Szerződési Feltételek" lastUpdated="2024. január 1.">
            <p className="lead">
                Kérjük, figyelmesen olvassa el az alábbi Általános Szerződési Feltételeket (továbbiakban: ÁSZF),
                mivel a weboldalunk használatával és szolgáltatásaink igénybevételével Ön elfogadja az itt leírtakat.
            </p>

            <h2>1. A Szolgáltató adatai</h2>
            <div className="not-prose bg-muted/30 p-4 rounded-lg border my-4 text-sm">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">Cégnév:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">BacklineIT</dd>
                    </div>
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">Székhely:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">2141 Csömör, Vörösmarty utca 11.</dd>
                    </div>
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">Adószám:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">Hamarosan</dd>
                    </div>
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">Email:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">support@backlineit.hu</dd>
                    </div>
                </dl>
            </div>

            <h2>2. Fogalommeghatározások</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Szolgáltató:</strong> A BacklineIT, amely a weboldalt üzemelteti és a szolgáltatásokat nyújtja.</li>
                <li><strong>Ügyfél:</strong> Bármely természetes vagy jogi személy, aki a Szolgáltató szolgáltatásait igénybe veszi.</li>
                <li><strong>Weboldal:</strong> A backlineit.hu domain alatt elérhető internetes felület.</li>
                <li><strong>Szolgáltatás:</strong> A weboldalon keresztül elérhető szoftverfejlesztési, tanácsadási és egyéb informatikai szolgáltatások.</li>
            </ul>

            <h2>3. A szerződés tárgya és létrejötte</h2>
            <p>
                A jelen ÁSZF hatálya kiterjed a Szolgáltató által nyújtott minden elektronikus kereskedelmi szolgáltatásra.
                A szerződés a Felek között ráutaló magatartással (a weboldalon történő regisztrációval, megrendelés leadásával) jön létre.
            </p>
            <p>
                A megrendelés elektronikus úton megkötött szerződésnek minősül, amelyre a polgári törvénykönyvről szóló 2013. évi V. törvény,
                az elektronikus kereskedelmi szolgáltatások, valamint az információs társadalommal összefüggő szolgáltatások egyes kérdéseiről szóló 2001. évi CVIII. törvény rendelkezései irányadóak.
            </p>

            <h2>4. Szolgáltatások igénybevétele</h2>
            <p>
                A Szolgáltató a weboldalon részletezett szolgáltatásokat (pl. webfejlesztés, scriptek, rendszerüzemeltetés) nyújtja.
                A szolgáltatások pontos tartalmát, díjazását és határidejét az egyedi árajánlatok vagy a webshopban feltüntetett termékleírások tartalmazzák.
            </p>

            <h2>5. Fizetési feltételek</h2>
            <p>
                A szolgáltatások ellenértékét az Ügyfél az alábbi módokon egyenlítheti ki:
            </p>
            <ul>
                <li><strong>Bankkártyás fizetés:</strong> A SimplePay vagy Stripe rendszerén keresztül.</li>
                <li><strong>Banki átutalás:</strong> A Szolgáltató által kiállított díjbekérő vagy számla alapján.</li>
            </ul>
            <p>
                A számlát a Szolgáltató elektronikus úton (e-számla) állítja ki és küldi meg az Ügyfél által megadott email címre.
            </p>

            <h2>6. Elállási jog</h2>
            <p>
                A fogyasztónak minősülő Ügyfél a 45/2014. (II. 26.) Korm. rendelet alapján jogosult a szerződéstől 14 napon belül indokolás nélkül elállni.
                Az elállási határidő a szolgáltatás nyújtására irányuló szerződés esetén a szerződés megkötésének napjától számított 14 nap.
            </p>
            <p>
                Ha a fogyasztó elállási jogával élni kíván, elállási szándékát tartalmazó egyértelmű nyilatkozatát köteles eljuttatni a Szolgáltatóhoz (például postán vagy elektronikus úton küldött levél útján) a jelen ÁSZF-ben feltüntetett elérhetőségek egyikére.
            </p>

            <h3>A fogyasztó elállási jogának elvesztése digitális adattartalom esetén</h3>
            <p>
                <strong>FIGYELEM:</strong> A nem tárgyi adathordozón nyújtott digitális adattartalom (pl. szoftverek, scriptek letöltése) tekintetében a fogyasztó elveszíti elállási jogát, amennyiben a Szolgáltató a fogyasztó kifejezett, előzetes beleegyezésével kezdte meg a teljesítést, és a fogyasztó e beleegyezésével egyidejűleg nyilatkozott annak tudomásulvételéről, hogy a teljesítés megkezdését követően elveszíti elállási jogát.
                <strong>A weboldalon történő vásárlás során a fizetés előtt a fogyasztónak kifejezetten nyilatkoznia kell arról, hogy tudomásul veszi az elállási jog elvesztését a letöltés/hozzáférés megkezdésével.</strong>
            </p>

            <h2>7. Kellékszavatosság, Termékszavatosság, Jótállás</h2>

            <h3>Kellékszavatosság</h3>
            <p>
                Az Ügyfél a Szolgáltató hibás teljesítése esetén a Szolgáltatóval szemben kellékszavatossági igényt érvényesíthet a Polgári Törvénykönyv szabályai szerint.
                Az Ügyfél kérhet kijavítást vagy kicserélést, kivéve, ha az ezek közül az Ügyfél által választott igény teljesítése lehetetlen vagy a Szolgáltató számára más igénye teljesítéséhez képest aránytalan többletköltséggel járna.
            </p>

            <h3>Termékszavatosság</h3>
            <p>
                Ingó dolog (termék) hibája esetén az Ügyfél – választása szerint – kellékszavatossági vagy termékszavatossági igényt érvényesíthet.
                Termékszavatossági igényként az Ügyfél kizárólag a hibás termék kijavítását vagy kicserélését kérheti.
            </p>

            <h3>Jótállás</h3>
            <p>
                Hibás teljesítés esetén a Szolgáltató jótállásra köteles, amennyiben azt jogszabály előírja vagy a Szolgáltató önként vállalta.
                A jótállás időtartama a vonatkozó jogszabályok (pl. 151/2003. (IX. 22.) Korm. rendelet) szerint alakul.
            </p>

            <h2>7. Szellemi tulajdonjogok</h2>
            <p>
                A weboldal teljes tartalma, beleértve a szövegeket, képeket, grafikákat, logókat és szoftvereket, a Szolgáltató szellemi tulajdonát képezi, és szerzői jogi védelem alatt áll.
                Azok bármilyen módon történő felhasználása, másolása vagy terjesztése kizárólag a Szolgáltató előzetes írásbeli hozzájárulásával lehetséges.
            </p>

            <h2>8. Felelősségkorlátozás</h2>
            <p>
                A Szolgáltató mindent megtesz a weboldal és a szolgáltatások zavartalan működése érdekében, de nem vállal felelősséget az internetes hálózat hibájából,
                technikai leállásokból vagy vis maior eseményekből eredő károkért.
            </p>

            <h2>9. Panaszkezelés</h2>
            <p>
                Az Ügyfél a szolgáltatással kapcsolatos panaszait a <a href="mailto:support@backlineit.hu">support@backlineit.hu</a> email címen jelezheti.
                A Szolgáltató a panaszt 30 napon belül kivizsgálja és írásban megválaszolja.
            </p>

            <h2>10. Záró rendelkezések</h2>
            <p>
                A jelen ÁSZF-ben nem szabályozott kérdésekben a magyar jogszabályok, különösen a Ptk. rendelkezései az irányadóak.
                A Szolgáltató fenntartja a jogot az ÁSZF egyoldalú módosítására, amelyről a weboldalon tájékoztatja az Ügyfeleket.
            </p>
        </LegalLayout>
    )
}
