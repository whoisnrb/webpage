import PDFDocument from "pdfkit"
import * as fs from "fs"
import * as path from "path"
import type { AuditReport } from "@/app/actions/security-audit"

const COLORS = {
    navy: "#0b1120",
    slateDark: "#0f172a",
    slateText: "#1e293b",
    slateMuted: "#64748b",
    slateLight: "#94a3b8",
    border: "#cbd5e1",
    borderLight: "#e2e8f0",
    bgSoft: "#f8fafc",
    bgCyanSoft: "#ecfeff",
    cyan: "#06b6d4",
    cyanDark: "#0891b2",
    emerald: "#10b981",
    emeraldBg: "#ecfdf5",
    emeraldText: "#047857",
    amber: "#f59e0b",
    amberBg: "#fffbeb",
    amberText: "#b45309",
    red: "#ef4444",
    redBg: "#fef2f2",
    redText: "#b91c1c",
    blue: "#3b82f6",
    blueBg: "#eff6ff",
    blueText: "#1d4ed8",
    white: "#ffffff",
}

function getScorePalette(score: number) {
    if (score >= 85) return { main: COLORS.emerald, bg: COLORS.emeraldBg, text: COLORS.emeraldText }
    if (score >= 65) return { main: COLORS.cyanDark, bg: COLORS.bgCyanSoft, text: COLORS.cyanDark }
    if (score >= 45) return { main: COLORS.amber, bg: COLORS.amberBg, text: COLORS.amberText }
    return { main: COLORS.red, bg: COLORS.redBg, text: COLORS.redText }
}

function getSeverityMeta(severity: "critical" | "warning" | "info") {
    if (severity === "critical") {
        return { label: "KRITIKUS", color: COLORS.red, bg: COLORS.redBg, textColor: COLORS.redText }
    }
    if (severity === "warning") {
        return { label: "FIGYELMEZTETÉS", color: COLORS.amber, bg: COLORS.amberBg, textColor: COLORS.amberText }
    }
    return { label: "INFORMÁCIÓ", color: COLORS.blue, bg: COLORS.blueBg, textColor: COLORS.blueText }
}

export async function generateSecurityAuditPdfBuffer(report: AuditReport): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margins: { top: 45, bottom: 52, left: 45, right: 45 },
                bufferPages: true,
                info: {
                    Title: `BacklineIT Kiberbiztonsági Audit Jelentés - ${report.domain}`,
                    Author: "BacklineIT Automata Kiberbiztonsági Audit Rendszer",
                    Subject: `IT Biztonsági Jelentés: ${report.domain}`,
                    Creator: "BacklineIT Core Engine",
                },
            })

            const chunks: Buffer[] = []
            doc.on("data", (chunk: Buffer) => chunks.push(chunk))
            doc.on("end", () => resolve(Buffer.concat(chunks)))
            doc.on("error", (err) => reject(err))

            // Load bundled Roboto TTF fonts for complete Hungarian Unicode glyph support (ő, ű, Ő, Ű)
            const fontsDir = path.join(process.cwd(), "public", "fonts")
            const regularPath = path.join(fontsDir, "Roboto-Regular.ttf")
            const mediumPath = path.join(fontsDir, "Roboto-Medium.ttf")
            const boldPath = path.join(fontsDir, "Roboto-Bold.ttf")

            const hasRoboto = fs.existsSync(regularPath) && fs.existsSync(boldPath)
            if (hasRoboto) {
                doc.registerFont("Regular", regularPath)
                doc.registerFont("Medium", fs.existsSync(mediumPath) ? mediumPath : regularPath)
                doc.registerFont("Bold", boldPath)
            } else {
                doc.registerFont("Regular", "Helvetica")
                doc.registerFont("Medium", "Helvetica")
                doc.registerFont("Bold", "Helvetica-Bold")
            }

            const pageWidth = doc.page.width
            const pageHeight = doc.page.height
            const margin = 45
            const contentWidth = pageWidth - margin * 2
            const bottomLimit = pageHeight - 58

            const drawMiniHeader = () => {
                doc.save()
                doc.rect(0, 0, pageWidth, 28).fill(COLORS.navy)
                doc.rect(0, 28, pageWidth, 2).fill(COLORS.cyan)
                doc.font("Bold").fontSize(8).fillColor(COLORS.white)
                    .text("BACKLINEIT // KIBERBIZTONSÁGI AUDIT JELENTÉS", margin, 9, { lineBreak: false })
                doc.font("Regular").fontSize(8).fillColor(COLORS.cyan)
                    .text(`${report.domain.toUpperCase()}  •  ${report.scanDate}`, margin, 9, {
                        width: contentWidth,
                        align: "right",
                        lineBreak: false,
                    })
                doc.restore()
                doc.y = 46
            }

            const ensureSpace = (neededHeight: number) => {
                if (doc.y + neededHeight > bottomLimit) {
                    doc.addPage()
                    drawMiniHeader()
                }
            }

            const drawSectionTitle = (title: string, subtitle?: string) => {
                ensureSpace(38)
                const y = doc.y
                doc.rect(margin, y + 2, 4, 15).fill(COLORS.cyanDark)
                doc.font("Bold").fontSize(12).fillColor(COLORS.navy)
                    .text(title, margin + 12, y)
                if (subtitle) {
                    doc.font("Regular").fontSize(8.5).fillColor(COLORS.slateMuted)
                        .text(subtitle, margin + 12, doc.y + 1)
                }
                doc.y += 8
            }

            // =========================================================================
            // 1. COVER / EXECUTIVE BANNER HEADER
            // =========================================================================
            doc.rect(0, 0, pageWidth, 118).fill(COLORS.navy)
            doc.rect(0, 118, pageWidth, 3).fill(COLORS.cyan)

            // Logo or Brand Wordmark
            const logoPath = path.join(process.cwd(), "public", "logo.png")
            let textStartX = margin
            if (fs.existsSync(logoPath)) {
                try {
                    doc.image(logoPath, margin, 22, { height: 34 })
                    textStartX = margin + 44
                } catch {
                    textStartX = margin
                }
            }

            doc.font("Bold").fontSize(15).fillColor(COLORS.white)
                .text("BACKLINEIT", textStartX, 24, { lineBreak: false })
            doc.font("Medium").fontSize(8.5).fillColor(COLORS.cyan)
                .text("AUTOMATA KIBERBIZTONSÁGI & IT AUDIT RENDSZER", textStartX, 42, { lineBreak: false })

            // Top-right classification pill
            doc.roundedRect(pageWidth - margin - 145, 22, 145, 20, 4)
                .fillOpacity(0.15).fill(COLORS.cyan).fillOpacity(1)
            doc.roundedRect(pageWidth - margin - 145, 22, 145, 20, 4)
                .lineWidth(0.75).stroke(COLORS.cyan)
            doc.font("Bold").fontSize(7.5).fillColor(COLORS.cyan)
                .text("VEZETŐI AUDIT JELENTÉS", pageWidth - margin - 145, 28, {
                    width: 145,
                    align: "center",
                    lineBreak: false,
                })

            // Target Domain Hero Title inside Banner
            doc.font("Regular").fontSize(8.5).fillColor(COLORS.slateLight)
                .text("VIZSGÁLT CÉLPONT / DOMAIN:", margin, 68, { lineBreak: false })
            doc.font("Bold").fontSize(18).fillColor(COLORS.white)
                .text(report.domain, margin, 80, { lineBreak: false })

            // Audit Metadata right side
            doc.font("Regular").fontSize(8).fillColor(COLORS.slateLight)
                .text(`Készült: ${report.scanDate}`, margin, 74, { width: contentWidth, align: "right", lineBreak: false })
            doc.font("Medium").fontSize(8).fillColor(COLORS.cyan)
                .text("Engine: Azure OpenAI GPT-4o Security", margin, 88, { width: contentWidth, align: "right", lineBreak: false })

            doc.y = 136

            // =========================================================================
            // 2. KPI SCORE + 3 TECHNICAL STATUS CARDS
            // =========================================================================
            const kpiY = doc.y
            const kpiHeight = 92
            const scorePalette = getScorePalette(report.score)

            // Card 1: Score Card (width: 132)
            const card1W = 132
            doc.roundedRect(margin, kpiY, card1W, kpiHeight, 8).fill(scorePalette.bg)
            doc.roundedRect(margin, kpiY, card1W, kpiHeight, 8).lineWidth(1).stroke(scorePalette.main)

            doc.font("Bold").fontSize(7.5).fillColor(COLORS.slateMuted)
                .text("BIZTONSÁGI PONTSZÁM", margin, kpiY + 10, { width: card1W, align: "center" })
            doc.font("Bold").fontSize(28).fillColor(scorePalette.text)
                .text(`${report.score}`, margin, kpiY + 26, { width: card1W, align: "center" })
            doc.font("Medium").fontSize(8).fillColor(COLORS.slateMuted)
                .text("/ 100 PONT", margin, kpiY + 56, { width: card1W, align: "center" })

            // Risk Pill
            doc.roundedRect(margin + 16, kpiY + 69, card1W - 32, 16, 4).fill(scorePalette.main)
            doc.font("Bold").fontSize(7.5).fillColor(COLORS.white)
                .text(`${report.riskLevel.toUpperCase()} KOCKÁZAT`, margin + 16, kpiY + 73, {
                    width: card1W - 32,
                    align: "center",
                    lineBreak: false,
                })

            // Card 2-4: Technical summary grid on the right
            const rightGridX = margin + card1W + 10
            const smallCardW = (contentWidth - card1W - 10 - 16) / 3
            const tech = report.technicalDetails

            const openDangerousPorts = tech.ports.filter(
                (p) => p.status === "open" && p.port !== 80 && p.port !== 443
            )

            const summaryCards = [
                {
                    title: "SSL / TLS VÉDELEM",
                    status: tech.ssl.valid ? "Érvényes SSL" : "Hiányzó / Hibás",
                    statusColor: tech.ssl.valid ? COLORS.emeraldText : COLORS.redText,
                    line1: tech.ssl.valid
                        ? `${tech.ssl.daysRemaining ?? "?"} nap érvényesség`
                        : (tech.ssl.error || "Nem biztonságos"),
                    line2: `Kibocsátó: ${tech.ssl.issuer || "Ismeretlen"}`,
                },
                {
                    title: "EMAIL VÉDELEM (DNS)",
                    status: tech.dns.hasSpf && tech.dns.hasDmarc
                        ? "Védett (SPF+DMARC)"
                        : tech.dns.hasSpf
                        ? "Részleges (Csak SPF)"
                        : "Védtelen Domain",
                    statusColor: tech.dns.hasSpf && tech.dns.hasDmarc
                        ? COLORS.emeraldText
                        : tech.dns.hasSpf
                        ? COLORS.amberText
                        : COLORS.redText,
                    line1: `SPF: ${tech.dns.hasSpf ? "Konfigurálva" : "Hiányzik"}`,
                    line2: `DMARC: ${tech.dns.hasDmarc ? "Aktív védelem" : "Hiányzik!"}`,
                },
                {
                    title: "HÁLÓZATI KITETTSÉG",
                    status: openDangerousPorts.length > 0
                        ? `${openDangerousPorts.length} Veszélyes Port`
                        : "Védett Hálózat",
                    statusColor: openDangerousPorts.length > 0 ? COLORS.redText : COLORS.emeraldText,
                    line1: openDangerousPorts.length > 0
                        ? `Nyitva: ${openDangerousPorts.map((p) => p.port).join(", ")}`
                        : "Csak 80/443 webport nyitott",
                    line2: `Szerver: ${tech.headers.serverHeader || "Rejtett / WAF"}`,
                },
            ]

            summaryCards.forEach((sc, idx) => {
                const cx = rightGridX + idx * (smallCardW + 8)
                doc.roundedRect(cx, kpiY, smallCardW, kpiHeight, 8).fill(COLORS.bgSoft)
                doc.roundedRect(cx, kpiY, smallCardW, kpiHeight, 8).lineWidth(0.75).stroke(COLORS.borderLight)

                doc.font("Bold").fontSize(7).fillColor(COLORS.slateMuted)
                    .text(sc.title, cx + 10, kpiY + 10, { width: smallCardW - 20 })
                doc.font("Bold").fontSize(9.5).fillColor(sc.statusColor)
                    .text(sc.status, cx + 10, kpiY + 24, { width: smallCardW - 20 })
                doc.font("Regular").fontSize(7.5).fillColor(COLORS.slateText)
                    .text(sc.line1, cx + 10, kpiY + 53, { width: smallCardW - 20, ellipsis: true })
                doc.font("Regular").fontSize(7).fillColor(COLORS.slateMuted)
                    .text(sc.line2, cx + 10, kpiY + 69, { width: smallCardW - 20, ellipsis: true })
            })

            doc.y = kpiY + kpiHeight + 18

            // =========================================================================
            // 3. EXECUTIVE SUMMARY
            // =========================================================================
            drawSectionTitle(
                "Vezetői Összefoglaló",
                "Üzleti és IT biztonsági helyzetkép cégvezetők és döntéshozók számára"
            )

            const summaryTextHeight = doc.font("Regular").fontSize(9.5)
                .heightOfString(report.summary, { width: contentWidth - 28, lineGap: 3 })
            const summaryBoxH = summaryTextHeight + 22
            ensureSpace(summaryBoxH + 10)

            const sumY = doc.y
            doc.roundedRect(margin, sumY, contentWidth, summaryBoxH, 6).fill(COLORS.bgSoft)
            doc.roundedRect(margin, sumY, contentWidth, summaryBoxH, 6).lineWidth(0.75).stroke(COLORS.borderLight)
            doc.rect(margin, sumY, 4, summaryBoxH).fill(COLORS.cyanDark)

            doc.font("Regular").fontSize(9.5).fillColor(COLORS.slateText)
                .text(report.summary, margin + 16, sumY + 11, {
                    width: contentWidth - 28,
                    lineGap: 3,
                })

            doc.y = sumY + summaryBoxH + 18

            // =========================================================================
            // 4. EXISTING STRENGTHS
            // =========================================================================
            if (report.strengths && report.strengths.length > 0) {
                drawSectionTitle("Meglévő Erősségek & Védelmi Vonalak")

                for (const s of report.strengths) {
                    const textH = doc.font("Regular").fontSize(9)
                        .heightOfString(s, { width: contentWidth - 46, lineGap: 2 })
                    const rowH = Math.max(24, textH + 12)
                    ensureSpace(rowH + 6)

                    const ry = doc.y
                    doc.roundedRect(margin, ry, contentWidth, rowH, 5).fill(COLORS.emeraldBg)
                    doc.roundedRect(margin, ry, contentWidth, rowH, 5).lineWidth(0.5).stroke("#a7f3d0")

                    doc.roundedRect(margin + 8, ry + 5, 24, 14, 3).fill(COLORS.emerald)
                    doc.font("Bold").fontSize(7).fillColor(COLORS.white)
                        .text("OK", margin + 8, ry + 8.5, { width: 24, align: "center", lineBreak: false })

                    doc.font("Regular").fontSize(9).fillColor(COLORS.slateText)
                        .text(s, margin + 38, ry + 6.5, { width: contentWidth - 46, lineGap: 2 })

                    doc.y = ry + rowH + 5
                }
                doc.y += 10
            }

            // =========================================================================
            // 5. IDENTIFIED VULNERABILITIES & RISKS
            // =========================================================================
            drawSectionTitle(
                `Feltárt Kockázatok & Sérülékenységek (${report.vulnerabilities.length} db)`,
                "A vizsgálat során azonosított biztonsági hiányosságok és azok javasolt javítása"
            )

            if (report.vulnerabilities.length === 0) {
                ensureSpace(36)
                const emptyY = doc.y
                doc.roundedRect(margin, emptyY, contentWidth, 32, 6).fill(COLORS.emeraldBg)
                doc.font("Medium").fontSize(9.5).fillColor(COLORS.emeraldText)
                    .text("Nem került feltárásra súlyos vagy azonnali beavatkozást igénylő sérülékenység.", margin + 14, emptyY + 10)
                doc.y = emptyY + 42
            } else {
                for (const v of report.vulnerabilities) {
                    const sev = getSeverityMeta(v.severity)
                    const titleH = doc.font("Bold").fontSize(10)
                        .heightOfString(v.title, { width: contentWidth - 115 })
                    const descH = doc.font("Regular").fontSize(8.8)
                        .heightOfString(v.description, { width: contentWidth - 26, lineGap: 2 })
                    const recText = `Javasolt javítás: ${v.recommendation}`
                    const recH = doc.font("Medium").fontSize(8.5)
                        .heightOfString(recText, { width: contentWidth - 40, lineGap: 2 })

                    const recBoxH = recH + 12
                    const cardH = Math.max(20, titleH) + 12 + descH + 8 + recBoxH + 14

                    ensureSpace(cardH + 8)
                    const cy = doc.y

                    // Outer Card
                    doc.roundedRect(margin, cy, contentWidth, cardH, 6).fill(COLORS.white)
                    doc.roundedRect(margin, cy, contentWidth, cardH, 6).lineWidth(0.75).stroke(COLORS.border)
                    doc.rect(margin, cy, 4, cardH).fill(sev.color)

                    // Severity Badge (top right)
                    const badgeW = 92
                    doc.roundedRect(margin + contentWidth - badgeW - 10, cy + 10, badgeW, 16, 4).fill(sev.bg)
                    doc.font("Bold").fontSize(7).fillColor(sev.textColor)
                        .text(sev.label, margin + contentWidth - badgeW - 10, cy + 14, {
                            width: badgeW,
                            align: "center",
                            lineBreak: false,
                        })

                    // Title
                    doc.font("Bold").fontSize(10).fillColor(COLORS.navy)
                        .text(v.title, margin + 14, cy + 11, { width: contentWidth - badgeW - 28 })

                    // Description
                    const descY = cy + Math.max(20, titleH) + 16
                    doc.font("Regular").fontSize(8.8).fillColor(COLORS.slateText)
                        .text(v.description, margin + 14, descY, { width: contentWidth - 26, lineGap: 2 })

                    // Recommendation Box
                    const recY = descY + descH + 8
                    doc.roundedRect(margin + 12, recY, contentWidth - 24, recBoxH, 4).fill(COLORS.bgCyanSoft)
                    doc.font("Medium").fontSize(8.5).fillColor(COLORS.cyanDark)
                        .text(recText, margin + 20, recY + 6, { width: contentWidth - 40, lineGap: 2 })

                    doc.y = cy + cardH + 8
                }
                doc.y += 8
            }

            // =========================================================================
            // 6. ACTION PLAN (PRIORITIZED ROADMAP)
            // =========================================================================
            if (report.actionPlan && report.actionPlan.length > 0) {
                drawSectionTitle(
                    "Prioritizált Védelmi Akcióterv",
                    "Ajánlott lépések a kockázatok minimalizálása és a rendszer megerősítése érdekében"
                )

                for (const item of report.actionPlan) {
                    const taskH = doc.font("Bold").fontSize(9.5)
                        .heightOfString(item.task, { width: contentWidth - 52 })
                    const impH = doc.font("Regular").fontSize(8.5)
                        .heightOfString(item.impact, { width: contentWidth - 52, lineGap: 2 })
                    const rowH = Math.max(34, taskH + impH + 18)

                    ensureSpace(rowH + 6)
                    const ry = doc.y

                    doc.roundedRect(margin, ry, contentWidth, rowH, 6).fill(COLORS.bgSoft)
                    doc.roundedRect(margin, ry, contentWidth, rowH, 6).lineWidth(0.6).stroke(COLORS.borderLight)

                    // Priority Number Badge
                    doc.roundedRect(margin + 10, ry + 8, 22, 22, 5).fill(COLORS.navy)
                    doc.font("Bold").fontSize(10).fillColor(COLORS.cyan)
                        .text(`${item.priority}`, margin + 10, ry + 13.5, { width: 22, align: "center", lineBreak: false })

                    doc.font("Bold").fontSize(9.5).fillColor(COLORS.navy)
                        .text(item.task, margin + 40, ry + 8, { width: contentWidth - 52 })
                    doc.font("Regular").fontSize(8.5).fillColor(COLORS.slateMuted)
                        .text(item.impact, margin + 40, ry + 10 + taskH, { width: contentWidth - 52, lineGap: 2 })

                    doc.y = ry + rowH + 6
                }
                doc.y += 10
            }

            // =========================================================================
            // 7. BACKLINEIT COMMERCIAL PROPOSAL CALLOUT
            // =========================================================================
            if (report.backlineProposal) {
                const headH = doc.font("Bold").fontSize(11)
                    .heightOfString(report.backlineProposal.headline, { width: contentWidth - 32 })
                const pitchH = doc.font("Regular").fontSize(9)
                    .heightOfString(report.backlineProposal.pitch, { width: contentWidth - 32, lineGap: 2.5 })
                const boxH = 26 + headH + 18 + pitchH + 34

                ensureSpace(boxH + 10)
                const py = doc.y

                doc.roundedRect(margin, py, contentWidth, boxH, 8).fill(COLORS.navy)
                doc.rect(margin, py, 5, boxH).fill(COLORS.cyan)

                doc.font("Bold").fontSize(7.5).fillColor(COLORS.cyan)
                    .text("BACKLINEIT SZAKMAI & ÜZLETI MEGOLDÁSI JAVASLAT", margin + 16, py + 12)

                doc.font("Bold").fontSize(11).fillColor(COLORS.white)
                    .text(report.backlineProposal.headline, margin + 16, py + 26, { width: contentWidth - 32 })

                const pkgY = py + 28 + headH + 4
                doc.font("Medium").fontSize(8.5).fillColor(COLORS.cyan)
                    .text(`Ajánlott megoldási csomag: ${report.backlineProposal.recommendedService}`, margin + 16, pkgY)

                const pitchY = pkgY + 16
                doc.font("Regular").fontSize(9).fillColor("#e2e8f0")
                    .text(report.backlineProposal.pitch, margin + 16, pitchY, { width: contentWidth - 32, lineGap: 2.5 })

                doc.font("Regular").fontSize(7.5).fillColor(COLORS.slateLight)
                    .text("Kapcsolat & Implementáció: info@backlineit.hu  •  https://backlineit.hu", margin + 16, py + boxH - 18)

                doc.y = py + boxH + 18
            }

            // =========================================================================
            // 8. TECHNICAL APPENDIX (HEADERS, DNS, PORTS)
            // =========================================================================
            drawSectionTitle(
                "Technikai Melléklet — Mélyszkenner Eredmények",
                `IP címek: ${tech.ipAddresses.length > 0 ? tech.ipAddresses.join(", ") : "Ismeretlen"}`
            )

            // 8A. HTTP Security Headers
            const headerRows = [
                { name: "Strict-Transport-Security (HSTS)", ok: tech.headers.hsts, value: tech.headers.hstsValue || (tech.headers.hsts ? "Engedélyezve" : "Hiányzik") },
                { name: "Content-Security-Policy (CSP)", ok: tech.headers.csp, value: tech.headers.csp ? "Konfigurálva" : "Hiányzik (XSS védelem nélkül)" },
                { name: "X-Frame-Options (Clickjacking)", ok: tech.headers.xfo, value: tech.headers.xfoValue || (tech.headers.xfo ? "Védett" : "Hiányzik") },
                { name: "X-Content-Type-Options (MIME)", ok: tech.headers.xcto, value: tech.headers.xcto ? "nosniff" : "Hiányzik" },
                { name: "Referrer-Policy", ok: tech.headers.referrerPolicy, value: tech.headers.referrerPolicy ? "Beállítva" : "Hiányzik" },
            ]

            ensureSpace(headerRows.length * 22 + 28)
            doc.font("Bold").fontSize(9.5).fillColor(COLORS.navy)
                .text("1. HTTP Biztonsági Fejlécek", margin, doc.y)
            doc.y += 6

            headerRows.forEach((hr, i) => {
                const ry = doc.y
                doc.rect(margin, ry, contentWidth, 21).fill(i % 2 === 0 ? COLORS.bgSoft : COLORS.white)
                doc.rect(margin, ry, contentWidth, 21).lineWidth(0.5).stroke(COLORS.borderLight)

                doc.font("Medium").fontSize(8.2).fillColor(COLORS.slateText)
                    .text(hr.name, margin + 10, ry + 6, { width: 215, lineBreak: false })

                const badgeBg = hr.ok ? COLORS.emeraldBg : COLORS.redBg
                const badgeColor = hr.ok ? COLORS.emeraldText : COLORS.redText
                const badgeTxt = hr.ok ? "VÉDETT" : "HIÁNYZIK"

                doc.roundedRect(margin + 230, ry + 3.5, 58, 14, 3).fill(badgeBg)
                doc.font("Bold").fontSize(6.8).fillColor(badgeColor)
                    .text(badgeTxt, margin + 230, ry + 7, { width: 58, align: "center", lineBreak: false })

                doc.font("Regular").fontSize(7.8).fillColor(COLORS.slateMuted)
                    .text(hr.value, margin + 296, ry + 6, { width: contentWidth - 304, ellipsis: true, lineBreak: false })

                doc.y = ry + 21
            })
            doc.y += 14

            // 8B. DNS & Email Security Records
            const spfStr = tech.dns.spfRecord || "Nincs konfigurálva"
            const dmarcStr = tech.dns.dmarcRecord || "Nincs konfigurálva"
            const mxStr = tech.dns.mxRecords.length > 0 ? tech.dns.mxRecords.join(", ") : "Nincs MX rekord"

            const spfH = doc.font("Regular").fontSize(7.8).heightOfString(spfStr, { width: contentWidth - 20 })
            const dmarcH = doc.font("Regular").fontSize(7.8).heightOfString(dmarcStr, { width: contentWidth - 20 })
            const dnsTotalH = 30 + spfH + dmarcH + 62

            ensureSpace(dnsTotalH)
            doc.font("Bold").fontSize(9.5).fillColor(COLORS.navy)
                .text("2. DNS & Email Hitelesítési Rekordok", margin, doc.y)
            doc.y += 6

            const drawCodeBox = (label: string, code: string) => {
                const cH = doc.font("Regular").fontSize(7.8).heightOfString(code, { width: contentWidth - 20 })
                const bH = cH + 22
                ensureSpace(bH + 5)
                const by = doc.y
                doc.roundedRect(margin, by, contentWidth, bH, 4).fill(COLORS.bgSoft)
                doc.roundedRect(margin, by, contentWidth, bH, 4).lineWidth(0.5).stroke(COLORS.borderLight)
                doc.font("Bold").fontSize(7.5).fillColor(COLORS.slateMuted).text(label, margin + 10, by + 5)
                doc.font("Regular").fontSize(7.8).fillColor(COLORS.navy).text(code, margin + 10, by + 16, { width: contentWidth - 20 })
                doc.y = by + bH + 5
            }

            drawCodeBox("SPF Rekord:", spfStr)
            drawCodeBox("DMARC Rekord:", dmarcStr)
            drawCodeBox("MX (Levelező Szerverek):", mxStr)
            doc.y += 10

            // 8C. Port Scan Results (2-column grid)
            const portRows = Math.ceil(tech.ports.length / 2)
            ensureSpace(portRows * 24 + 34)

            doc.font("Bold").fontSize(9.5).fillColor(COLORS.navy)
                .text("3. Hálózati Port Szkennelés Eredményei", margin, doc.y)
            doc.y += 6

            const portColW = (contentWidth - 10) / 2
            const portStartY = doc.y

            tech.ports.forEach((p, idx) => {
                const col = idx % 2
                const row = Math.floor(idx / 2)
                const px = margin + col * (portColW + 10)
                const py = portStartY + row * 23

                const isOpen = p.status === "open"
                const isDanger = isOpen && p.port !== 80 && p.port !== 443

                doc.roundedRect(px, py, portColW, 20, 4).fill(isDanger ? COLORS.redBg : COLORS.bgSoft)
                doc.roundedRect(px, py, portColW, 20, 4).lineWidth(0.5).stroke(isDanger ? COLORS.red : COLORS.borderLight)

                doc.font("Bold").fontSize(8).fillColor(COLORS.navy)
                    .text(`Port ${p.port} (${p.service})`, px + 8, py + 6, { width: portColW - 76, lineBreak: false })

                const pBadgeBg = isDanger ? COLORS.red : isOpen ? COLORS.emerald : COLORS.slateMuted
                doc.roundedRect(px + portColW - 60, py + 3.5, 52, 13, 3).fill(pBadgeBg)
                doc.font("Bold").fontSize(6.8).fillColor(COLORS.white)
                    .text(p.status.toUpperCase(), px + portColW - 60, py + 6.5, {
                        width: 52,
                        align: "center",
                        lineBreak: false,
                    })
            })

            doc.y = portStartY + portRows * 23 + 12

            // =========================================================================
            // 9. RUNNING FOOTER ON EVERY PAGE
            // =========================================================================
            const range = doc.bufferedPageRange()
            const totalPages = range.count
            for (let i = range.start; i < range.start + totalPages; i++) {
                doc.switchToPage(i)
                // Zero bottom margin temporarily so footer rendering below margin doesn't trigger new blank pages
                const prevBottom = doc.page.margins.bottom
                doc.page.margins.bottom = 0

                const footerY = pageHeight - 36
                doc.moveTo(margin, footerY - 6)
                    .lineTo(pageWidth - margin, footerY - 6)
                    .lineWidth(0.5)
                    .stroke(COLORS.borderLight)

                doc.font("Regular").fontSize(7.5).fillColor(COLORS.slateMuted)
                    .text(
                        `© ${new Date().getFullYear()} BacklineIT • Automata Kiberbiztonsági Audit Jelentés • Bizalmas dokumentum (${report.domain})`,
                        margin,
                        footerY,
                        { width: contentWidth - 80, lineBreak: false }
                    )

                doc.font("Bold").fontSize(7.5).fillColor(COLORS.slateText)
                    .text(`Oldal ${i + 1} / ${totalPages}`, margin, footerY, {
                        width: contentWidth,
                        align: "right",
                        lineBreak: false,
                    })

                doc.page.margins.bottom = prevBottom
            }

            doc.end()
        } catch (err) {
            reject(err)
        }
    })
}
