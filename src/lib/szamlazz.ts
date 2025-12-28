interface InvoiceOrder {
    orderRef: string;
    totalAmount: number;
}

interface InvoiceUser {
    name: string;
    email: string;
}

export async function createInvoice(order: InvoiceOrder, user: InvoiceUser) {
    const agentUrl = "https://www.szamlazz.hu/szamla/"

    // Generate XML payload
    // Note: This is a simplified example. In production, use a proper XML builder.
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <xmlszamla xmlns="http://www.szamlazz.hu/xmlszamla" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.szamlazz.hu/xmlszamla https://www.szamlazz.hu/szamla/docs/xsds/agent/xmlszamla.xsd">
        <beallitasok>
            <szamlaagentkulcs>${process.env.SZAMLAZZ_TOKEN}</szamlaagentkulcs>
            <eszamla>true</eszamla>
            <szamlaLetoltes>true</szamlaLetoltes>
            <valaszVerzio>2</valaszVerzio>
        </beallitasok>
        <fejlec>
            <keltDatum>${new Date().toISOString().split('T')[0]}</keltDatum>
            <teljesitesDatum>${new Date().toISOString().split('T')[0]}</teljesitesDatum>
            <fizetesiHataridoDatum>${new Date().toISOString().split('T')[0]}</fizetesiHataridoDatum>
            <fizmod>Bankkártya</fizmod>
            <penznem>HUF</penznem>
            <szamlaNyelve>hu</szamlaNyelve>
            <megjegyzes>Rendelés azonosító: ${order.orderRef}</megjegyzes>
            <rendelesSzam>${order.orderRef}</rendelesSzam>
            <dijbekero>false</dijbekero>
            <vegszamla>false</vegszamla>
            <szamlaszamElotag>E</szamlaszamElotag>
        </fejlec>
        <elado>
            <bank>OTP Bank</bank>
            <bankszamlaszam>11700000-00000000-00000000</bankszamlaszam>
            <emailReplyto>hello@itservices.hu</emailReplyto>
            <emailTargy>Számla értesítő</emailTargy>
            <emailSzoveg>Köszönjük a vásárlást!</emailSzoveg>
        </elado>
        <vevo>
            <nev>${user.name}</nev>
            <irsz>1117</irsz>
            <telepules>Budapest</telepules>
            <cim>Irinyi József utca 4-20.</cim>
            <email>${user.email}</email>
            <sendEmail>false</sendEmail>
        </vevo>
        <tetelek>
            <tetel>
                <megnevezes>Szoftver licenc</megnevezes>
                <mennyiseg>1.0</mennyiseg>
                <mennyisegiEgyseg>db</mennyisegiEgyseg>
                <nettoEgysegar>${Math.round(order.totalAmount / 1.27)}</nettoEgysegar>
                <afakulcs>27</afakulcs>
                <nettoErtek>${Math.round(order.totalAmount / 1.27)}</nettoErtek>
                <afaErtek>${order.totalAmount - Math.round(order.totalAmount / 1.27)}</afaErtek>
                <bruttoErtek>${order.totalAmount}</bruttoErtek>
            </tetel>
        </tetelek>
    </xmlszamla>`

    // Send request
    const formData = new FormData()
    formData.append("action-xmlagentxmlfile", new Blob([xml], { type: "text/xml" }))

    try {
        const response = await fetch(agentUrl, {
            method: "POST",
            body: formData
        })

        if (!response.ok) {
            throw new Error(`Számlázz.hu error: ${response.statusText}`)
        }

        const responseText = await response.text()

        // Check for success in XML response (simplified check)
        if (responseText.includes("<sikeres>true</sikeres>")) {
            // Extract PDF URL or content if needed
            // For now, we assume success
            return { success: true }
        } else {
            console.error("Számlázz.hu response:", responseText)
            return { success: false, error: "Invoice generation failed" }
        }

    } catch (error) {
        console.error("Számlázz.hu error:", error)
        return { success: false, error: String(error) }
    }
}
