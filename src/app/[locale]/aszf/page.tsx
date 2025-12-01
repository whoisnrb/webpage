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
                        <dd className="font-medium inline md:block ml-2 md:ml-0">IT Services Kft.</dd>
                    </div>
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">Székhely:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">1138 Budapest, Váci út 123.</dd>
                    </div>
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">Cégjegyzékszám:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">01-09-123456</dd>
                    </div>
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">Adószám:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">12345678-2-41</dd>
                    </div>
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">Email:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">info@itservices.hu</dd>
                    </div>
                </dl>
            </div>

            <h2>2. Fogalommeghatározások</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Szolgáltató:</strong> Az IT Services Kft., amely a weboldalt üzemelteti és a szolgáltatásokat nyújtja.</li>
                <li><strong>Ügyfél:</strong> Bármely természetes vagy jogi személy, aki a Szolgáltató szolgáltatásait igénybe veszi.</li>
                <li><strong>Weboldal:</strong> Az itservices.hu domain alatt elérhető internetes felület.</li>
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
                Fogyasztónak minősülő Ügyfél esetén a 45/2014. (II. 26.) Korm. rendelet alapján 14 napon belüli elállási jog illeti meg.
            </p>
            <p>
                <strong>Kivételek:</strong> Nem gyakorolható az elállási jog olyan nem előre gyártott termék esetében, amelyet a fogyasztó utasítása alapján vagy kifejezett kérésére állítottak elő (pl. egyedi szoftverfejlesztés),
                illetve olyan digitális adattartalom tekintetében, amely nem tárgyi adathordozón nyújtanak (pl. letölthető scriptek), ha a Szolgáltató a fogyasztó kifejezett, előzetes beleegyezésével kezdte meg a teljesítést.
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
                Az Ügyfél a szolgáltatással kapcsolatos panaszait az <a href="mailto:info@itservices.hu">info@itservices.hu</a> email címen jelezheti.
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
