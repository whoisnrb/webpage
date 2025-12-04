import { LegalLayout } from "@/components/layout/legal-layout"

export default function ImpresszumPage() {
    return (
        <LegalLayout title="Impresszum" lastUpdated="2024. január 1.">
            <p className="lead">
                Az elektronikus kereskedelmi szolgáltatások, valamint az információs társadalommal összefüggő szolgáltatások egyes kérdéseiről szóló 2001. évi CVIII. törvény alapján.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 not-prose">
                <div className="bg-muted/30 p-6 rounded-xl border">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        Szolgáltató adatai
                    </h2>
                    <dl className="space-y-4 text-sm">
                        <div>
                            <dt className="text-muted-foreground mb-1">Cégnév / Vállalkozó neve</dt>
                            <dd className="font-medium text-base">BacklineIT</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">Székhely</dt>
                            <dd className="font-medium">2141 Csömör, Vörösmarty utca 11.</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">Levelezési cím</dt>
                            <dd className="font-medium">2141 Csömör, Vörösmarty utca 11.</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">Adószám</dt>
                            <dd className="font-medium">Hamarosan</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">Képviselő</dt>
                            <dd className="font-medium">Kovács János ügyvezető</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">Tárhelyszolgáltató</dt>
                            <dd className="font-medium">Vercel Inc. (lásd lentebb)</dd>
                        </div>
                    </dl>
                </div>

                <div className="bg-muted/30 p-6 rounded-xl border">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        Ügyfélszolgálat és Elérhetőségek
                    </h2>
                    <dl className="space-y-4 text-sm">
                        <div>
                            <dt className="text-muted-foreground mb-1">Email (Ügyfélszolgálat)</dt>
                            <dd className="font-medium text-base">
                                <a href="mailto:support@backlineit.hu" className="text-primary hover:underline">support@backlineit.hu</a>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">Telefon</dt>
                            <dd className="font-medium">Hamarosan</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">Weboldal</dt>
                            <dd className="font-medium">www.backlineit.hu</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">Ügyfélszolgálat rendelkezésre állása</dt>
                            <dd className="font-medium">Hétfő - Péntek: 09:00 - 17:00</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <h2>Tárhelyszolgáltató</h2>
            <p>
                A weboldal üzemeltetését és tárolását az alábbi szolgáltató végzi:
            </p>
            <div className="bg-muted/30 p-6 rounded-xl border not-prose">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-muted-foreground mb-1">Név</dt>
                        <dd className="font-medium">Vercel Inc.</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground mb-1">Székhely</dt>
                        <dd className="font-medium">340 S Lemon Ave #4133 Walnut, CA 91789, USA</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground mb-1">Weboldal</dt>
                        <dd className="font-medium">
                            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a>
                        </dd>
                    </div>
                </dl>
            </div>

            <h2>Vitarendezés</h2>
            <p>
                Az Európai Bizottság online vitarendezési platformja (ODR) lehetőséget biztosít a fogyasztóknak a jogviták bíróságon kívüli rendezésére.
                A platform elérhető az alábbi linken: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">http://ec.europa.eu/consumers/odr</a>.
            </p>
        </LegalLayout>
    )
}
