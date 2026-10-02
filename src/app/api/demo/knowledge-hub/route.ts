import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Realistic enterprise document knowledge bases
const KNOWLEDGE_DOCUMENTS: Record<string, { titleHu: string; titleEn: string; contentHu: string; contentEn: string }> = {
    "hr-policy": {
        titleHu: "Backline Tech Kft. – Munkarend, Szabadságolási és Home Office Szabályzat (2026)",
        titleEn: "Backline Tech Ltd. – Working Hours, Leave & Remote Work Policy (2026)",
        contentHu: `
[DOKUMENTUM: BACKLINE TECH KFT. - SZABÁLYZAT 2026/01]
1. FEJEZET: MUNKAIDŐ ÉS HOME OFFICE RENDJE
1.1. Alap munkaidő: Heti 40 óra, törzsidő 10:00 - 15:00 között kötelező elérhetőséggel a Slacken és Teamsen.
1.2. Hibrid munkarend: Minden munkavállaló heti legfeljebb 3 munkanapot tölthet távmunkában (home office). A hétfői és csütörtöki napok javasolt irodai napok a személyes egyeztetések miatt.
1.3. Home office bejelentése: A távmunkát a közvetlen csoportvezetőnek a belső Google Naptárban legkésőbb 24 órával előre jelezni kell.
1.4. Túlóra és ügyelet: A rendes munkaidőn túli munkavégzés kizárólag csoportvezetői jóváhagyással lehetséges. Hétköznapi túlóra díjazása: 150%, hétvégi és ünnepnapi készenlét / ügyelet: 200%-os pótlékkal kerül elszámolásra a havi bérszámfejtésben.

2. FEJEZET: SZABADSÁGOLÁSI SZABÁLYZAT
2.1. Rendes szabadság: A munkavállalónak a tervezett szabadságát legalább 15 munkanappal korábban be kell nyújtania a HR Portálon keresztül.
2.2. Év végi szabadság: A tárgyévi szabadságból legfeljebb 5 munkanap vihető át a következő év március 31-ig, kivéve ha a munkáltató érdekkörében felmerült ok gátolta a kivételt.
2.3. Próbaidő: A próbaidő tartama a munkaszerződés keltétől számított 3 naptári hónap. Próbaidő alatt fizetett rendes szabadság nem vehető igénybe, kivéve rendkívüli családi esemény vagy halaszthatatlan orvosi ok esetén, a közvetlen ügyvezető írásos engedélyével.

3. FEJEZET: JUTTATÁSOK, KÉPZÉS ÉS ESZKÖZÖK
3.1. Cafeteria keret: Minden teljes munkaidős alkalmazott évi bruttó 650.000 Ft cafeteria juttatásban részesül, amely SZÉP kártya alszámlákra (szállás, vendéglátás, szabadidő) osztható szét.
3.2. Céges hardver: A cég Apple MacBook Pro vagy Dell XPS munkaállomást biztosít. Az eszközök amortizációs ciklusa 36 hónap; a 3 év lejárta után a munkavállaló jelképes 10.000 Ft maradványértéken megvásárolhatja az eszközt.
3.3. Szakmai fejlődési keret: Évente munkavállalónként 300.000 Ft képzési büdzsé áll rendelkezésre szakmai tanfolyamokra, könyvekre vagy nemzetközi certifikációkra (pl. Azure Solutions Architect, AWS, Scrum Master).
`,
        contentEn: `
[DOCUMENT: BACKLINE TECH LTD. - POLICY 2026/01]
CHAPTER 1: WORKING HOURS AND REMOTE WORK (HOME OFFICE)
1.1. Core working hours: 40 hours per week, with mandatory core presence between 10:00 AM and 3:00 PM CET on Slack and Microsoft Teams.
1.2. Hybrid schedule: Employees may spend up to 3 business days per week working remotely (home office). Mondays and Thursdays are designated collaborative in-office days.
1.3. Notice for remote work: Remote days must be registered in the internal company calendar at least 24 hours in advance.
1.4. Overtime & On-call duty: Overtime requires prior written approval from the team lead. Weekday overtime is compensated at 150%, while weekend and public holiday on-call shifts are remunerated at 200%.

CHAPTER 2: VACATION AND LEAVE ENTITLEMENT
2.1. Standard annual leave: Leave requests must be submitted through the internal HR Portal at least 15 business days in advance.
2.2. Rollover limit: A maximum of 5 unused vacation days may be carried over to the subsequent calendar year, expiring on March 31.
2.3. Probationary period: The standard probationary period is 3 calendar months. Paid recreational leave cannot be scheduled during probation, except for extraordinary family emergencies approved in writing by the Managing Director.

CHAPTER 3: BENEFITS, HARDWARE & PROFESSIONAL DEVELOPMENT
3.1. Cafeteria benefit: Full-time personnel receive an annual gross cafeteria allowance of 650,000 HUF, distributable into national SZÉP leisure/dining accounts.
3.2. Hardware refresh: Employees are equipped with an Apple MacBook Pro or Dell XPS workstation. Hardware refresh cycle is 36 months; thereafter, the employee can purchase the laptop for a symbolic 10,000 HUF residual value.
3.3. Learning allowance: An individual budget of 300,000 HUF per year is allocated for technical certifications (e.g. Azure Architect, AWS, Scrum), books, and conferences.
`
    },
    "it-security": {
        titleHu: "Backline IT – ISO 27001 Információbiztonsági és Eszközhasználati Szabályzat",
        titleEn: "Backline IT – ISO 27001 Information Security & Device Usage Standard",
        contentHu: `
[DOKUMENTUM: BACKLINE IT - ISO 27001 BIZTONSÁGI KÉZIKÖNYV]
1. FEJEZET: JELSZÓKEZELÉS ÉS TÖBBFAKTOROS HITELESÍTÉS (MFA)
1.1. Jelszó összetettség: Minden céges hozzáféréshez legalább 14 karakter hosszúságú jelszó kötelező, amely tartalmaz kis- és nagybetűt, számot és legalább egy speciális karaktert (!@#$%^&*).
1.2. Kétlépcsős azonosítás (2FA / MFA): Minden fiókban (Google Workspace, Azure, GitHub, VPN) kötelező a hardveres biztonsági kulcs (YubiKey) vagy FIDO2 / Microsoft Authenticator használata. SMS alapú 2FA biztonsági okokból tiltott.
1.3. Jelszócsere szabályzat: A rendszeres 90 napos jelszócsere tilos az NIST SP 800-63B irányelv szerint. Csak kompromittálódás vagy gyanús bejelentkezési kísérlet esetén kötelező azonnali csere.

2. FEJEZET: MES TERSÉGES INTELLIGENCIA (AI) ÉS ADATVÉDELEM
2.1. Publikus AI eszközök tilalma: Szigorúan tilos ügyféladatokat, forráskódot, személyes adatot (PII) vagy pénzügyi adatot feltölteni nyilvános, ingyenes AI modellekbe (pl. nyilvános ChatGPT, Claude Free, Gemini Free).
2.2. Vállalati privát AI használata: Kizárólag a vállalat által konfigurált privát Microsoft Azure OpenAI környezet (Backline Vision és belső modellek) használható üzleti adatok elemzésére, mivel az Azure szerződés garantálja, hogy a feltöltött adatok nem kerülnek modelltanításra.

3. FEJEZET: BIZTONSÁGI INCIDENSEK ÉS ESZKÖZVESZTÉS PROTOKOLL
3.1. Értesítési kötelezettség: Bármilyen biztonsági incidenst (phishing gyanú, zsarolóvírus, illetéktelen hozzáférés) a felismeréstől számított 60 percen belül jelezni kell a security@backline.hu címen és az IT Vezetőnél.
3.2. Céges eszköz elvesztése: Laptop vagy telefon elvesztése esetén a munkavállaló köteles azonnal telefonon hívni a 24/7 IT forródrótot (+36 30 999 1122), hogy a Microsoft Intune rendszeren keresztül távolról törölhessék (remote wipe) az eszközt.
3.3. Adatmentés: Minden munkafájlt a céges felhőtárhelyen (OneDrive / GitHub) kell tárolni. A lokális merevlemez csak ideiglenes munkaterületnek minősül, arra központi mentés nem vonatkozik.
`,
        contentEn: `
[DOCUMENT: BACKLINE IT - ISO 27001 SECURITY HANDBOOK]
CHAPTER 1: ACCESS CONTROL AND MULTI-FACTOR AUTHENTICATION (MFA)
1.1. Password complexity: All corporate credentials must be at least 14 characters long, containing uppercase and lowercase letters, numbers, and at least one special character.
1.2. Multi-factor authentication: Hardware keys (YubiKey) or authenticator apps (Microsoft Authenticator / FIDO2) are strictly mandatory across Google Workspace, Azure, GitHub, and VPNs. SMS-based 2FA is prohibited.
1.3. Password rotation: Mandatory periodic password rotation is discontinued following NIST SP 800-63B guidelines. Passwords must only be reset upon suspected compromise.

CHAPTER 2: ARTIFICIAL INTELLIGENCE (AI) AND DATA GOVERNANCE
2.1. Public AI prohibition: Uploading client confidential data, proprietary code, personal identifiable information (PII), or financial records to public AI platforms (e.g. free ChatGPT) is strictly forbidden.
2.2. Approved enterprise AI: Staff must exclusively utilize company-managed private Microsoft Azure OpenAI endpoints, which contractually ensure customer prompts are never retained or used for foundation model training.

CHAPTER 3: INCIDENT RESPONSE AND ASSET LOSS
3.1. Reporting deadline: Any suspected breach, phishing attempt, or anomaly must be reported within 60 minutes to security@backline.hu and the CISO.
3.2. Lost or stolen equipment: In case of hardware loss or theft, personnel must immediately contact the 24/7 IT emergency dispatch (+36 30 999 1122) to trigger an immediate remote wipe via Microsoft Intune.
3.3. Cloud storage: Working files must be synchronized with corporate cloud storage (OneDrive / GitHub). Local drives are temporary caches not covered by central backup snapshots.
`
    },
    "procurement": {
        titleHu: "Backline Group – Beszerzési, Pénzügyi Kötelezettségvállalási és Jóváhagyási Rend",
        titleEn: "Backline Group – Procurement, Financial Authorization & Signing Policy",
        contentHu: `
[DOKUMENTUM: BACKLINE GROUP - PÉNZÜGYI ÉS BESZERZÉSI REND]
1. FEJEZET: KÖTELEZETTSÉGVÁLLALÁSI ÉS JÓVÁHAGYÁSI ÉRTÉKHATÁROK
1.1. 0 – 150.000 Ft: Közvetlen csoportvezetői jóváhagyás elegendő, egyetlen indokolt beszállítói árajánlat alapján.
1.2. 150.001 – 1.500.000 Ft: Részlegvezető (Head of Department) jóváhagyása szükséges, valamint kötelező a Pénzügyi Osztály előzetes fedezetvizsgálata és ellenjegyzése.
1.3. 1.500.001 – 6.000.000 Ft: Gazdasági Igazgató (CFO) engedélye szükséges, és kötelező legalább 3 független, összehasonlítható beszállítói árajánlat bekérése és mellékelése a beszerzési jegyzőkönyvhöz.
1.4. 6.000.000 Ft felett: Kizárólag az Ügyvezető Igazgató (CEO) és a CFO együttes aláírásával és jóváhagyásával vállalható kötelezettség.

2. FEJEZET: SZÁMLABEFOGADÁS ÉS FIZETÉSI FELTÉTELEK
2.1. Számlák formátuma: A Backline kizárólag a NAV Online Számla rendszerében ellenőrizhető, elektronikus számlát (e-számla) fogad be, amelyet a penzugy@backline.hu címre kell megküldeni.
2.2. Fizetési határidő: A céges sztenderd fizetési határidő 30 naptári nap a teljesítésigazolás kiállításától számítva. 8 vagy 15 napos fizetési határidő csak előzetes CFO jóváhagyással köthető ki.
2.3. Készpénzes fizetés: Készpénzes vásárlás kizárólag váratlan irodai kisértékű kiadásra (maximum 30.000 Ft) engedélyezett, elszámolása 3 munkanapon belül, névre szóló számla leadásával kötelező.

3. FEJEZET: SZERZŐDÉSKÖTÉSI PROTOKOLL
3.1. Szerződések véleményezése: Minden 1.000.000 Ft feletti vagy folyamatos szolgáltatásra vonatkozó szerződést a Jogi Osztálynak véleményeznie kell aláírás előtt (átfutási idő: max. 48 óra).
3.2. Digitális aláírás: A társaság elsődlegesen az AVDH (Ügyfélkapu) vagy minősített elektronikus aláírással (e-Szignó, DocuSign) ellátott digitális dokumentumokat tekinti érvényesnek.
`,
        contentEn: `
[DOCUMENT: BACKLINE GROUP - PROCUREMENT & SIGNING POLICY]
CHAPTER 1: FINANCIAL AUTHORIZATION THRESHOLDS
1.1. 0 – 150,000 HUF: Team Lead approval is sufficient based on a single justified supplier quote.
1.2. 150,001 – 1,500,000 HUF: Head of Department authorization required, alongside budget clearance from the Finance Department.
1.3. 1,500,001 – 6,000,000 HUF: Chief Financial Officer (CFO) approval required, with mandatory procurement tender comparing at least 3 independent bids.
1.4. Above 6,000,000 HUF: Solely executable with dual sign-off from both the CEO and CFO.

CHAPTER 2: INVOICING AND SETTLEMENT TERMS
2.1. Invoice standard: Only electronically verifiable e-invoices compliant with tax authority standards sent to penzugy@backline.hu will be processed.
2.2. Settlement timeline: Corporate default payment term is 30 calendar days following formal performance sign-off. Accelerated 8 or 15-day terms require written CFO waiver.
2.3. Petty cash: Petty cash expenditures are strictly capped at 30,000 HUF for emergent sundry office supplies, requiring receipt reconciliation within 3 business days.

CHAPTER 3: CONTRACTUAL REVIEW & EXECUTION
3.1. Legal clearance: Any recurring service contract or commitment exceeding 1,000,000 HUF requires formal review by Corporate Legal (SLA: 48 business hours).
3.2. Digital signing: Contracts must be signed using qualified electronic signatures (eIDAS compliant: DocuSign, Microsec e-Szignó, or Government AVDH).
`
    }
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query, documentId = "hr-policy", locale = "hu" } = body;

        if (!query || typeof query !== "string") {
            return NextResponse.json(
                { error: "Kérdés megadása kötelező" },
                { status: 400 }
            );
        }

        const isEn = locale === "en";
        const selectedDoc = KNOWLEDGE_DOCUMENTS[documentId] || KNOWLEDGE_DOCUMENTS["hr-policy"];
        const docContent = isEn ? selectedDoc.contentEn : selectedDoc.contentHu;
        const docTitle = isEn ? selectedDoc.titleEn : selectedDoc.titleHu;

        const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://hello-6780-resource.services.ai.azure.com/openai/v1";
        const apiKey = process.env.AZURE_OPENAI_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";

        if (!apiKey) {
            return NextResponse.json({ error: "Azure OpenAI API kulcs hiányzik" }, { status: 500 });
        }

        const systemPrompt = isEn
            ? `You are Backline Knowledge Hub, an enterprise RAG (Retrieval-Augmented Generation) document assistant running on Microsoft Azure.
Your task is to answer the user's question with 100% factual fidelity STRICTLY based on the provided corporate document below.

RULES:
1. Zero Hallucination: Answer ONLY using information explicitly stated in the document. If the document does not contain the answer, explicitly state: "The provided document does not contain information regarding this topic."
2. Explicit Citations: You MUST cite the exact Chapter, Section number, and include the exact relevant quote from the document.
3. Output Format: You must output a strictly valid JSON object:
{
  "answer": "Clear, professional, and direct answer to the user's question.",
  "confidenceScore": "99.8%",
  "documentTitle": "${docTitle}",
  "citations": [
    {
      "chapter": "e.g. Chapter 1: Working Hours",
      "section": "e.g. Section 1.2",
      "quote": "Exact verbatim quote from the text that proves the answer."
    }
  ],
  "recommendedFollowUps": [
    "Suggested question 1",
    "Suggested question 2"
  ]
}

DOCUMENT CONTENT:
"""
${docContent}
"""`
            : `Te a Backline Knowledge Hub vagy, a Microsoft Azure felhőben futó vállalati RAG (Retrieval-Augmented Generation) tudásbázis asszisztens.
A feladatod, hogy a felhasználó kérdésére 100%-os ténybeli pontossággal válaszolj KIZÁRÓLAG az alábbi hivatalos vállalati szabályzat szövege alapján.

SZABÁLYOK:
1. Nulla hallucináció: CSAK és KIZÁRÓLAG a mellékelt dokumentumban található információkból válaszolj. Ha a dokumentum nem tartalmazza a választ, mondd meg őszintén: "A megadott szabályzat nem tartalmaz információt erre a témára vonatkozóan."
2. Pontos forráshivatkozás: KÖTELEZŐ megadnod a pontos Fejezetet, Pontszámot és az idézett bekezdés részletét.
3. Kimeneti formátum: Szigorúan érvényes JSON objektumot kell visszaadnod:
{
  "answer": "Érthető, professzionális, közvetlen válasz a kérdésre.",
  "confidenceScore": "99.8%",
  "documentTitle": "${docTitle}",
  "citations": [
    {
      "chapter": "pl. 1. Fejezet: Munkaidő és Home Office rendje",
      "section": "pl. 1.2. pont",
      "quote": "Pontos idézet a dokumentumból, ami igazolja a választ."
    }
  ],
  "recommendedFollowUps": [
    "Javasolt kapcsolódó kérdés 1",
    "Javasolt kapcsolódó kérdés 2"
  ]
}

A SZABÁLYZAT TARTALMA:
"""
${docContent}
"""`;

        const targetUrl = `${endpoint.replace(/\/+$/, "")}/chat/completions`;

        const azureResponse = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify({
                model: deployment,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: query }
                ],
                max_tokens: 800,
                response_format: { type: "json_object" }
            })
        });

        if (!azureResponse.ok) {
            const errorText = await azureResponse.text();
            console.error("Azure Knowledge Hub Error:", errorText);
            return NextResponse.json(
                { error: "Hiba a tudásbázis lekérdezése során", details: errorText },
                { status: azureResponse.status }
            );
        }

        const data = await azureResponse.json();
        const rawContent = data.choices?.[0]?.message?.content || "{}";

        let parsedData = {};
        try {
            parsedData = JSON.parse(rawContent);
        } catch (e) {
            console.warn("JSON parse fallback:", e);
        }

        return NextResponse.json({
            success: true,
            data: parsedData,
            usage: {
                totalTokens: data.usage?.total_tokens || 0,
                approxCostHuf: ((data.usage?.total_tokens || 0) * 0.0014).toFixed(2)
            }
        });

    } catch (error: any) {
        console.error("Knowledge Hub Route Error:", error);
        return NextResponse.json(
            { error: "Szerverhiba történt", message: error.message },
            { status: 500 }
        );
    }
}
