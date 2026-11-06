"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import * as dns from "dns"
import * as tls from "tls"
import * as net from "net"

export interface TechnicalScanResult {
    domain: string
    ipAddresses: string[]
    dns: {
        hasSpf: boolean
        spfRecord?: string
        hasDmarc: boolean
        dmarcRecord?: string
        mxRecords: string[]
    }
    ssl: {
        valid: boolean
        validFrom?: string
        validTo?: string
        daysRemaining?: number
        issuer?: string
        subject?: string
        protocol?: string
        error?: string
    }
    headers: {
        hsts: boolean
        hstsValue?: string
        csp: boolean
        cspValue?: string
        xfo: boolean
        xfoValue?: string
        xcto: boolean
        referrerPolicy: boolean
        serverHeader?: string
        xPoweredBy?: string
    }
    ports: Array<{
        port: number
        service: string
        status: "open" | "closed" | "filtered"
    }>
}

export interface SecurityVulnerability {
    severity: "critical" | "warning" | "info"
    title: string
    description: string
    recommendation: string
}

export interface AuditReport {
    domain: string
    scanDate: string
    score: number // 0 - 100
    riskLevel: "Kritikus" | "Magas" | "Közepes" | "Jó" | "Kiváló"
    summary: string
    strengths: string[]
    vulnerabilities: SecurityVulnerability[]
    actionPlan: Array<{
        priority: number
        task: string
        impact: string
    }>
    backlineProposal: {
        headline: string
        recommendedService: string
        pitch: string
    }
    technicalDetails: TechnicalScanResult
}

// Helper: Clean domain input
function sanitizeDomain(input: string): string {
    let clean = input.trim().toLowerCase()
    clean = clean.replace(/^https?:\/\//i, "")
    clean = clean.replace(/\/.*$/, "")
    clean = clean.replace(/:\d+$/, "")
    return clean
}

// Helper: Check TLS Certificate
function checkTlsCert(domain: string): Promise<TechnicalScanResult["ssl"]> {
    return new Promise((resolve) => {
        try {
            const socket = tls.connect(443, domain, { servername: domain, timeout: 6000 }, () => {
                const cert = socket.getPeerCertificate()
                const protocol = socket.getProtocol() || undefined
                socket.end()

                if (!cert || !cert.valid_to) {
                    return resolve({ valid: false, error: "Nincs érvényes tanúsítvány" })
                }

                const validToDate = new Date(cert.valid_to)
                const now = new Date()
                const daysRemaining = Math.max(0, Math.round((validToDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

                resolve({
                    valid: socket.authorized,
                    validFrom: cert.valid_from,
                    validTo: cert.valid_to,
                    daysRemaining,
                    issuer: cert.issuer ? (cert.issuer.O || cert.issuer.CN || "Ismeretlen kibocsátó") : "Ismeretlen",
                    subject: cert.subject ? cert.subject.CN : domain,
                    protocol,
                })
            })

            socket.on("error", (err) => resolve({ valid: false, error: err.message }))
            socket.on("timeout", () => {
                socket.destroy()
                resolve({ valid: false, error: "Kapcsolódási időtúllépés (TLS timeout)" })
            })
        } catch (e: any) {
            resolve({ valid: false, error: e.message || "Nem sikerült a TLS kapcsolat" })
        }
    })
}

// Helper: Check Single Port
function checkPort(host: string, port: number, timeout = 1500): Promise<"open" | "closed" | "filtered"> {
    return new Promise((resolve) => {
        const socket = new net.Socket()
        let status: "open" | "closed" | "filtered" = "closed"

        socket.setTimeout(timeout)
        socket.on("connect", () => {
            status = "open"
            socket.destroy()
        })
        socket.on("timeout", () => {
            status = "filtered"
            socket.destroy()
        })
        socket.on("error", () => {
            status = "closed"
        })
        socket.on("close", () => {
            resolve(status)
        })

        try {
            socket.connect(port, host)
        } catch {
            resolve("closed")
        }
    })
}

export async function runSecurityScan(rawDomain: string): Promise<{
    success: boolean
    data?: AuditReport
    error?: string
}> {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return {
                success: false,
                error: "Nem engedélyezett művelet: Csak adminisztrátor futtathat biztonsági auditot."
            }
        }

        const domain = sanitizeDomain(rawDomain)
        if (!domain || !domain.includes(".")) {
            return {
                success: false,
                error: "Kérlek, adj meg egy érvényes domain nevet (pl.: cegnev.hu)!"
            }
        }

        const dnsPromises = dns.promises

        // 1. DNS & IP resolution
        let ipAddresses: string[] = []
        try {
            ipAddresses = await dnsPromises.resolve4(domain)
        } catch {
            try {
                const cnames = await dnsPromises.resolveCname(domain)
                if (cnames.length > 0) {
                    ipAddresses = await dnsPromises.resolve4(cnames[0])
                }
            } catch {
                ipAddresses = []
            }
        }

        // 2. SPF & DMARC & MX
        let hasSpf = false
        let spfRecord: string | undefined = undefined
        let hasDmarc = false
        let dmarcRecord: string | undefined = undefined
        let mxRecords: string[] = []

        try {
            const txtRecords = await dnsPromises.resolveTxt(domain)
            const flatTxt = txtRecords.flat()
            const foundSpf = flatTxt.find((t) => t.toLowerCase().startsWith("v=spf1"))
            if (foundSpf) {
                hasSpf = true
                spfRecord = foundSpf
            }
        } catch {
            // No TXT
        }

        try {
            const dmarcTxt = await dnsPromises.resolveTxt(`_dmarc.${domain}`)
            const flatDmarc = dmarcTxt.flat()
            const foundDmarc = flatDmarc.find((t) => t.toLowerCase().startsWith("v=dmarc1"))
            if (foundDmarc) {
                hasDmarc = true
                dmarcRecord = foundDmarc
            }
        } catch {
            // No DMARC
        }

        try {
            const mx = await dnsPromises.resolveMx(domain)
            mxRecords = mx.map((m) => `${m.exchange} (prio: ${m.priority})`)
        } catch {
            // No MX
        }

        // 3. TLS Certificate Check
        const ssl = await checkTlsCert(domain)

        // 4. HTTP Headers Check
        let headers: TechnicalScanResult["headers"] = {
            hsts: false,
            csp: false,
            xfo: false,
            xcto: false,
            referrerPolicy: false,
        }

        try {
            const res = await fetch(`https://${domain}`, {
                method: "GET",
                redirect: "follow",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BacklineIT-SecurityAuditor/2.0",
                },
                signal: AbortSignal.timeout(7000),
            })

            const hsts = res.headers.get("strict-transport-security")
            const csp = res.headers.get("content-security-policy")
            const xfo = res.headers.get("x-frame-options")
            const xcto = res.headers.get("x-content-type-options")
            const referrer = res.headers.get("referrer-policy")
            const server = res.headers.get("server")
            const powered = res.headers.get("x-powered-by")

            headers = {
                hsts: !!hsts,
                hstsValue: hsts || undefined,
                csp: !!csp,
                cspValue: csp ? (csp.length > 80 ? csp.substring(0, 80) + "..." : csp) : undefined,
                xfo: !!xfo,
                xfoValue: xfo || undefined,
                xcto: xcto?.toLowerCase().includes("nosniff") || false,
                referrerPolicy: !!referrer,
                serverHeader: server || undefined,
                xPoweredBy: powered || undefined,
            }
        } catch {
            // If https fails, try http or record error
        }

        // 5. Port Scan
        const targetHost = ipAddresses[0] || domain
        const portList = [
            { port: 80, service: "HTTP Web" },
            { port: 443, service: "HTTPS Web (SSL)" },
            { port: 21, service: "FTP Fájltranszfer" },
            { port: 22, service: "SSH Távoli Elérés" },
            { port: 3306, service: "MySQL Adatbázis" },
            { port: 5432, service: "PostgreSQL Adatbázis" },
            { port: 8080, service: "Alternatív Web Port" },
        ]

        const portResults = await Promise.all(
            portList.map(async (p) => {
                const status = await checkPort(targetHost, p.port, 1500)
                return {
                    port: p.port,
                    service: p.service,
                    status,
                }
            })
        )

        const technicalDetails: TechnicalScanResult = {
            domain,
            ipAddresses,
            dns: {
                hasSpf,
                spfRecord,
                hasDmarc,
                dmarcRecord,
                mxRecords,
            },
            ssl,
            headers,
            ports: portResults,
        }

        // 6. Azure OpenAI GPT-4o Security Assessment
        const rawEndpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://hello-6780-resource.services.ai.azure.com/openai/v1"
        const apiKey = process.env.AZURE_OPENAI_KEY
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o"

        if (!apiKey) {
            return {
                success: false,
                error: "Az Azure OpenAI API kulcs nincs konfigurálva a szerveren.",
            }
        }

        const apiUrl = rawEndpoint.endsWith("/v1")
            ? `${rawEndpoint}/chat/completions`
            : `${rawEndpoint}/openai/v1/chat/completions`

        const systemPrompt = `Te a BacklineIT vezető kiberbiztonsági mérnöke és etikus hacker auditora vagy.
A feladatod: egy megadott domain technikai vizsgálati eredményeiből professzionális, magyar nyelvű Kiberbiztonsági Audit Jelentés generálása KKV cégvezetők és IT döntéshozók számára.

A pontozási logika (0 - 100):
- SSL: ha le van járva vagy nincs HTTPS: -30 pont. Ha érvényes és TLS 1.3/1.2: +20 pont.
- Email hitelesítés: Ha nincs SPF: -15 pont (könnyű phishing/email hamisítás). Ha nincs DMARC: -15 pont. Ha van SPF és DMARC p=reject/quarantine: +25 pont.
- Biztonsági HTTP fejlécek: HSTS hiánya: -10 pont. CSP hiánya: -10 pont. X-Frame-Options hiánya: -10 pont.
- Nyitott veszélyes portok (SSH 22 publikusan nyitva, adatbázis 3306/5432 internet felé nyitva, FTP 21): portonként -20 pont azonnali kritikus kockázat!
- Szoftver verzió szivárgás (Server vagy X-Powered-By fejlécekben): -5 pont.

Kimeneti formátum: KIZÁRÓLAG érvényes JSON a következő struktúrával:
{
  "score": 75,
  "riskLevel": "Közepes",
  "summary": "2-3 bekezdéses magyar nyelvű vezetői összefoglaló: mi az oldal jelenlegi biztonsági állapota, mi a legnagyobb kitettség (pl. email hamisítás, adatbázis sebezhetőség, hiányzó titkosítás), és mi ennek a valós üzleti következménye (zsarolóvírus, csaló számlák, leállás).",
  "strengths": ["Erősség 1 (pl. Érvényes modern TLS 1.3 titkosítás)", "Erősség 2"],
  "vulnerabilities": [
    {
      "severity": "critical",
      "title": "Hiányzó DMARC Email Védelem",
      "description": "A domain nem rendelkezik DMARC rekorddal, így illetéktelenek a cég nevében küldhetnek hamis emaileket a partnereknek és ügyfeleknek.",
      "recommendation": "DMARC TXT rekord beállítása p=quarantine vagy p=reject szabályzattal a DNS-ben."
    }
  ],
  "actionPlan": [
    {
      "priority": 1,
      "task": "Azonnali feladat leírása",
      "impact": "Várható kockázatcsökkenés vagy eredmény"
    }
  ],
  "backlineProposal": {
    "headline": "Hogyan oldja meg ezt a BacklineIT csapata?",
    "recommendedService": "KKV IT Biztonsági Audit & Havidíjas Rendszergazda",
    "pitch": "Konkrét, meggyőző B2B ajánlat arról, hogyan zárjuk le a talált réseket 48 órán belül a havidíjas üzemeltetésünk vagy auditunk keretében."
  }
}`

        const userMessage = `Kérlek, elemezd a következő technikai szkenner adatokat és készítsd el a teljes audit jelentést:
Domain: ${domain}
Technikai eredmények JSON:
${JSON.stringify(technicalDetails, null, 2)}`

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
            body: JSON.stringify({
                model: deployment,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage },
                ],
                response_format: { type: "json_object" },
                temperature: 0.3,
                max_tokens: 3000,
            }),
        })

        if (!response.ok) {
            const errText = await response.text()
            return {
                success: false,
                error: `Azure OpenAI hiba (${response.status}): ${errText.substring(0, 150)}`,
            }
        }

        const json = await response.json()
        const contentStr = json?.choices?.[0]?.message?.content
        if (!contentStr) {
            return {
                success: false,
                error: "Nem érkezett tartalom az AI motortól.",
            }
        }

        const parsedAi = JSON.parse(contentStr)

        const finalReport: AuditReport = {
            domain,
            scanDate: new Date().toLocaleString("hu-HU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
            score: Math.min(100, Math.max(0, parsedAi.score || 50)),
            riskLevel: parsedAi.riskLevel || "Közepes",
            summary: parsedAi.summary || "",
            strengths: parsedAi.strengths || [],
            vulnerabilities: parsedAi.vulnerabilities || [],
            actionPlan: parsedAi.actionPlan || [],
            backlineProposal: parsedAi.backlineProposal || {
                headline: "Hogyan segít a BacklineIT?",
                recommendedService: "KKV IT Biztonsági Audit",
                pitch: "Zárjuk le a sérülékenységeket gyorsan és szakszerűen.",
            },
            technicalDetails,
        }

        // Audit log
        try {
            if (session.user.id) {
                await prisma.auditLog.create({
                    data: {
                        action: "SECURITY_AUDIT_SCAN",
                        entity: "SecurityAuditRobot",
                        details: JSON.stringify({
                            domain,
                            score: finalReport.score,
                            riskLevel: finalReport.riskLevel,
                        }),
                        userId: session.user.id,
                    },
                })
            }
        } catch (auditErr) {
            console.warn("Audit log creation skipped:", auditErr)
        }

        return {
            success: true,
            data: finalReport,
        }
    } catch (err: any) {
        console.error("Security audit error:", err)
        return {
            success: false,
            error: err.message || "Hiba történt a biztonsági vizsgálat során.",
        }
    }
}
