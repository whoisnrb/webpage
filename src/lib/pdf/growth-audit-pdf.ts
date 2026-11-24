import PDFDocument from "pdfkit"
import * as fs from "fs"
import * as path from "path"
import type { GrowthAuditReport } from "@/app/actions/growth-audit"

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
    purple: "#8b5cf6",
    purpleBg: "#f5f3ff",
    purpleText: "#6d28d9",
    white: "#ffffff",
}

function getScorePalette(score: number) {
    if (score >= 80) return { main: COLORS.emerald, bg: COLORS.emeraldBg, text: COLORS.emeraldText, label: "KIVÁLÓ" }
    if (score >= 60) return { main: COLORS.cyanDark, bg: COLORS.bgCyanSoft, text: COLORS.cyanDark, label: "MEGFELELŐ" }
    if (score >= 40) return { main: COLORS.amber, bg: COLORS.amberBg, text: COLORS.amberText, label: "FEJLESZTENDŐ" }
    return { main: COLORS.red, bg: COLORS.redBg, text: COLORS.redText, label: "KRITIKUS" }
}

export async function generateGrowthAuditPdfBuffer(report: GrowthAuditReport): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margins: { top: 45, bottom: 52, left: 45, right: 45 },
                bufferPages: true,
                info: {
                    Title: `BacklineIT Stratégiai Növekedési & Weboldal Audit - ${report.domain}`,
                    Author: "BacklineIT Rendszermérnöki Csapat",
                    Subject: `Weboldal Elemzés és Növekedési Stratégia: ${report.domain}`,
                    Creator: "BacklineIT Strategic Growth Engine",
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
                    .text("BACKLINEIT // STRATÉGIAI NÖVEKEDÉSI & WEBOLDAL AUDIT", margin, 9, { lineBreak: false })
                doc.font("Regular").fontSize(8).fillColor(COLORS.cyan)
                    .text(`${report.domain.toUpperCase()}  •  ${report.analyzedAt}`, margin, 9, {
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
                ensureSpace(42)
                const y = doc.y
                doc.rect(margin, y + 2, 4, 16).fill(COLORS.cyanDark)
                doc.font("Bold").fontSize(12).fillColor(COLORS.navy)
                    .text(title, margin + 12, y)
                if (subtitle) {
                    doc.font("Regular").fontSize(8.5).fillColor(COLORS.slateMuted)
                        .text(subtitle, margin + 12, doc.y + 1)
                }
                doc.y += 10
            }

            // =========================================================================
            // 1. COVER / EXECUTIVE HERO BANNER
            // =========================================================================
            doc.rect(0, 0, pageWidth, 120).fill(COLORS.navy)
            doc.rect(0, 120, pageWidth, 3).fill(COLORS.cyan)

            const logoPath = path.join(process.cwd(), "public", "logo.png")
            let textStartX = margin
            if (fs.existsSync(logoPath)) {
                try {
                    doc.image(logoPath, margin, 20, { height: 34 })
                    textStartX = margin + 44
                } catch {
                    textStartX = margin
                }
            }

            doc.font("Bold").fontSize(16).fillColor(COLORS.white)
                .text("BACKLINEIT", textStartX, 22, { lineBreak: false })
            doc.font("Medium").fontSize(8.5).fillColor(COLORS.cyan)
                .text("DIGITÁLIS TRANSZFORMÁCIÓ & WEBOLDAL NÖVEKEDÉSI AUDIT", textStartX, 40, { lineBreak: false })

            // Right Pill (Grade & Score)
            const pillW = 150
            const gradePalette = getScorePalette(report.overallScore)
            doc.roundedRect(pageWidth - margin - pillW, 20, pillW, 30, 4)
                .fillOpacity(0.18).fill(gradePalette.main).fillOpacity(1)
            doc.roundedRect(pageWidth - margin - pillW, 20, pillW, 30, 4)
                .lineWidth(0.75).stroke(gradePalette.main)

            doc.font("Bold").fontSize(11).fillColor(gradePalette.main)
                .text(`ÖSSZPONTSZÁM: ${report.overallScore} / 100`, pageWidth - margin - pillW, 25, {
                    width: pillW,
                    align: "center",
                    lineBreak: false,
                })
            doc.font("Regular").fontSize(7.5).fillColor(COLORS.white)
                .text(`BESOROLÁS: ${report.grade} (${gradePalette.label})`, pageWidth - margin - pillW, 37, {
                    width: pillW,
                    align: "center",
                    lineBreak: false,
                })

            // Target Info
            doc.font("Regular").fontSize(8.5).fillColor(COLORS.slateLight)
                .text("AUDITÁLT VÁLLALKOZÁS & WEBOLDAL:", margin, 70, { lineBreak: false })
            doc.font("Bold").fontSize(16).fillColor(COLORS.white)
                .text(`${report.businessName} — ${report.domain}`, margin, 82, { lineBreak: false })

            doc.font("Regular").fontSize(8).fillColor(COLORS.slateLight)
                .text(`Vizsgálat dátuma: ${report.analyzedAt}`, margin, 74, { width: contentWidth, align: "right", lineBreak: false })
            doc.font("Medium").fontSize(8).fillColor(COLORS.cyan)
                .text("Hitelesített BacklineIT Rendszeraudit", margin, 88, { width: contentWidth, align: "right", lineBreak: false })

            doc.y = 138

            // =========================================================================
            // 2. 4 EXECUTIVE KPI CARDS
            // =========================================================================
            const kpiY = doc.y
            const kpiHeight = 84
            const cardSpacing = 8
            const cardW = (contentWidth - cardSpacing * 3) / 4

            const kpiConfigs = [
                {
                    title: "BETÖLTÉSI SEBESSÉG",
                    score: `${report.pillars.speed.score}/100`,
                    status: report.pillars.speed.status,
                    palette: getScorePalette(report.pillars.speed.score),
                    sub1: `TTFB: ${report.pillars.speed.ttfbMs} ms`,
                    sub2: `Tömörítés: ${report.pillars.speed.compression}`,
                },
                {
                    title: "IT & BIZTONSÁG",
                    score: `${report.pillars.security.score}/100`,
                    status: report.pillars.security.status,
                    palette: getScorePalette(report.pillars.security.score),
                    sub1: report.pillars.security.hasSsl ? "SSL: Érvényes" : "SSL: Hiányzik!",
                    sub2: report.pillars.security.hsts ? "HSTS: Bekapcsolva" : "HSTS: Hiányzik",
                },
                {
                    title: "SEO ÉS LÁTHATÓSÁG",
                    score: `${report.pillars.seo.score}/100`,
                    status: report.pillars.seo.status,
                    palette: getScorePalette(report.pillars.seo.score),
                    sub1: `Title: ${report.pillars.seo.titleLength} kar.`,
                    sub2: report.pillars.seo.hasSitemap ? "Sitemap: Rendben" : "Sitemap: Hiányzik",
                },
                {
                    title: "KONVERZIÓ & TECH",
                    score: `${report.pillars.cro.score}/100`,
                    status: report.pillars.cro.status,
                    palette: getScorePalette(report.pillars.cro.score),
                    sub1: report.pillars.cro.hasMobileViewport ? "Mobil: Reszponzív" : "Mobil: Nem reszponzív",
                    sub2: report.pillars.cro.hasCta ? "CTA gombok: Észlelve" : "CTA: Hiányos",
                },
            ]

            kpiConfigs.forEach((kpi, index) => {
                const cardX = margin + index * (cardW + cardSpacing)
                doc.roundedRect(cardX, kpiY, cardW, kpiHeight, 6)
                    .fill(COLORS.bgSoft)
                    .lineWidth(0.75)
                    .stroke(COLORS.borderLight)

                // Top color accent bar
                doc.roundedRect(cardX, kpiY, cardW, 4, 2).fill(kpi.palette.main)

                doc.font("Bold").fontSize(7.5).fillColor(COLORS.slateMuted)
                    .text(kpi.title, cardX + 8, kpiY + 10, { width: cardW - 16, lineBreak: false })

                doc.font("Bold").fontSize(18).fillColor(kpi.palette.text)
                    .text(kpi.score, cardX + 8, kpiY + 22, { lineBreak: false })

                // Pill
                doc.roundedRect(cardX + 8, kpiY + 44, cardW - 16, 14, 3)
                    .fill(kpi.palette.bg)
                doc.font("Bold").fontSize(7).fillColor(kpi.palette.text)
                    .text(kpi.status.toUpperCase(), cardX + 8, kpiY + 47, { width: cardW - 16, align: "center", lineBreak: false })

                doc.font("Regular").fontSize(6.5).fillColor(COLORS.slateMuted)
                    .text(kpi.sub1, cardX + 8, kpiY + 62, { width: cardW - 16, lineBreak: false })
                    .text(kpi.sub2, cardX + 8, kpiY + 71, { width: cardW - 16, lineBreak: false })
            })

            doc.y = kpiY + kpiHeight + 16

            // =========================================================================
            // 3. EXECUTIVE SUMMARY
            // =========================================================================
            drawSectionTitle("1. VEZETŐI ÖSSZEGZÉS & STRATÉGIAI HELYZETKÉP", "A digitális infrastruktúra üzleti hatása és megtérülése")

            const summaryBoxY = doc.y
            doc.roundedRect(margin, summaryBoxY, contentWidth, 70, 6)
                .fill(COLORS.bgSoft)
                .lineWidth(0.5)
                .stroke(COLORS.border)

            doc.roundedRect(margin, summaryBoxY, 4, 70, 2).fill(COLORS.cyanDark)

            doc.font("Regular").fontSize(9).fillColor(COLORS.slateText)
                .text(report.executiveSummary, margin + 14, summaryBoxY + 12, {
                    width: contentWidth - 28,
                    lineGap: 3.5,
                })

            doc.y = summaryBoxY + 82

            // =========================================================================
            // 4. STRENGTHS & BOTTLENECKS
            // =========================================================================
            drawSectionTitle("2. ERŐSSÉGEK ÉS KRITIKUS SZŰKKERESZTMETSZETEK", "Mi működik jól, és mi akadályozza a vevőszerzést?")

            const halfW = (contentWidth - 12) / 2
            const startBoxY = doc.y
            const boxH = 92

            // Strengths box
            doc.roundedRect(margin, startBoxY, halfW, boxH, 6)
                .fill(COLORS.emeraldBg)
                .lineWidth(0.5)
                .stroke(COLORS.emerald)
            doc.font("Bold").fontSize(9).fillColor(COLORS.emeraldText)
                .text("AZONNALI VERSENYELŐNYÖK (ERŐSSÉGEK):", margin + 10, startBoxY + 8)

            let strengthY = startBoxY + 24
            report.keyStrengths.slice(0, 4).forEach((str) => {
                doc.font("Regular").fontSize(7.5).fillColor(COLORS.emeraldText)
                    .text(`✔  ${str}`, margin + 10, strengthY, { width: halfW - 20, lineBreak: false })
                strengthY += 16
            })

            // Bottlenecks box
            const botX = margin + halfW + 12
            doc.roundedRect(botX, startBoxY, halfW, boxH, 6)
                .fill(COLORS.redBg)
                .lineWidth(0.5)
                .stroke(COLORS.red)
            doc.font("Bold").fontSize(9).fillColor(COLORS.redText)
                .text("BEVÉTELT CSÖKKENTŐ SZŰKKERESZTMETSZETEK:", botX + 10, startBoxY + 8)

            let botY = startBoxY + 24
            report.criticalBottlenecks.slice(0, 4).forEach((bot) => {
                doc.font("Regular").fontSize(7.5).fillColor(COLORS.redText)
                    .text(`⚠  ${bot}`, botX + 10, botY, { width: halfW - 20, lineBreak: false })
                botY += 16
            })

            doc.y = startBoxY + boxH + 18

            // =========================================================================
            // 5. DETAILED TECHNICAL FINDINGS ACROSS 4 PILLARS
            // =========================================================================
            ensureSpace(180)
            drawSectionTitle("3. RÉSZLETES TECHNIKAI & ÜZLETI ELEMZÉS", "A 4 fő pillér vizsgálati eredményei és ajánlásai")

            const renderPillarDetails = (
                title: string,
                score: number,
                metrics: { label: string; val: string }[],
                recs: string[]
            ) => {
                ensureSpace(74)
                const y = doc.y
                const pPalette = getScorePalette(score)

                doc.roundedRect(margin, y, contentWidth, 68, 5)
                    .fill(COLORS.bgSoft)
                    .lineWidth(0.5)
                    .stroke(COLORS.borderLight)

                doc.roundedRect(margin, y, 4, 68, 2).fill(pPalette.main)

                doc.font("Bold").fontSize(9).fillColor(COLORS.navy)
                    .text(title, margin + 12, y + 8, { lineBreak: false })
                doc.font("Bold").fontSize(8.5).fillColor(pPalette.text)
                    .text(`Értékelés: ${score}/100`, margin + 12, y + 8, { width: contentWidth - 24, align: "right", lineBreak: false })

                // Metrics row
                let mX = margin + 12
                metrics.forEach((m) => {
                    doc.font("Bold").fontSize(7).fillColor(COLORS.slateMuted)
                        .text(`${m.label}: `, mX, y + 24, { lineBreak: false })
                    doc.font("Medium").fontSize(7).fillColor(COLORS.slateText)
                        .text(m.val, doc.x, y + 24, { lineBreak: false })
                    mX += 130
                })

                // Recommendations
                let recY = y + 38
                recs.slice(0, 2).forEach((rec) => {
                    doc.font("Regular").fontSize(7).fillColor(COLORS.slateDark)
                        .text(`• ${rec}`, margin + 12, recY, { width: contentWidth - 24, lineGap: 1.5 })
                    recY += 13
                })

                doc.y = y + 74
            }

            renderPillarDetails(
                "I. Sebesség & Szerver Kiszolgálás (Core Web Vitals)",
                report.pillars.speed.score,
                [
                    { label: "TTFB idő", val: `${report.pillars.speed.ttfbMs} ms` },
                    { label: "Protokoll", val: report.pillars.speed.httpVersion },
                    { label: "Tömörítés", val: report.pillars.speed.compression },
                ],
                report.pillars.speed.recommendations
            )

            renderPillarDetails(
                "II. IT Biztonság & Kiberhigiénia",
                report.pillars.security.score,
                [
                    { label: "SSL Tanúsítvány", val: report.pillars.security.hasSsl ? "Érvényes" : "Hiányzik" },
                    { label: "HSTS Fejléc", val: report.pillars.security.hsts ? "Aktív" : "Inaktív" },
                    { label: "CSP Védelem", val: report.pillars.security.csp ? "Konfigurálva" : "Hiányzik" },
                ],
                report.pillars.security.recommendations
            )

            renderPillarDetails(
                "III. Keresőoptimalizálás (SEO) & Organikus Találatok",
                report.pillars.seo.score,
                [
                    { label: "Title Hossz", val: `${report.pillars.seo.titleLength} kar.` },
                    { label: "H1 Címkék", val: `${report.pillars.seo.h1Count} db` },
                    { label: "OpenGraph", val: report.pillars.seo.hasOpenGraph ? "Van" : "Nincs" },
                ],
                report.pillars.seo.recommendations
            )

            renderPillarDetails(
                "IV. Konverzió & Technológiai Ökoszisztéma",
                report.pillars.cro.score,
                [
                    { label: "Mobil Reszponzivitás", val: report.pillars.cro.hasMobileViewport ? "Igen" : "Nem" },
                    { label: "CTA Elemek", val: report.pillars.cro.hasCta ? "Észlelve" : "Gyenge" },
                    { label: "Észlelt Technológiák", val: report.pillars.cro.detectedTech.join(", ").slice(0, 32) },
                ],
                report.pillars.cro.recommendations
            )

            // =========================================================================
            // 6. 30-60-90 DAY STRATEGIC GROWTH ROADMAP
            // =========================================================================
            ensureSpace(160)
            drawSectionTitle("4. 30–60–90 NAPOS STRATÉGIAI NÖVEKEDÉSI AKCIÓTERV", "Lépésről lépésre végrehajtható feladatok a maximális megtérüléshez")

            const phases = [
                { data: report.roadmap.phase30, badgeColor: COLORS.cyanDark, badgeBg: COLORS.bgCyanSoft },
                { data: report.roadmap.phase60, badgeColor: COLORS.purpleText, badgeBg: COLORS.purpleBg },
                { data: report.roadmap.phase90, badgeColor: COLORS.emeraldText, badgeBg: COLORS.emeraldBg },
            ]

            phases.forEach((phase) => {
                ensureSpace(48)
                const pY = doc.y
                doc.roundedRect(margin, pY, contentWidth, 42, 5)
                    .fill(COLORS.bgSoft)
                    .lineWidth(0.5)
                    .stroke(COLORS.borderLight)

                doc.roundedRect(margin, pY, 4, 42, 2).fill(phase.badgeColor)

                doc.font("Bold").fontSize(8.5).fillColor(phase.badgeColor)
                    .text(phase.data.title, margin + 12, pY + 7, { lineBreak: false })

                let itY = pY + 20
                const itemsText = phase.data.items.slice(0, 2).join("   •   ")
                doc.font("Regular").fontSize(7).fillColor(COLORS.slateText)
                    .text(`• ${itemsText}`, margin + 12, itY, { width: contentWidth - 24, lineBreak: false })

                doc.y = pY + 47
            })

            // =========================================================================
            // 7. VERIFIED SEAL & BACKLINEIT SIGNATURE BOX
            // =========================================================================
            ensureSpace(85)
            const sealY = doc.y + 6
            doc.roundedRect(margin, sealY, contentWidth, 68, 6)
                .fill(COLORS.navy)

            doc.font("Bold").fontSize(10).fillColor(COLORS.white)
                .text("HITELESÍTETT BACKLINEIT STRATÉGIAI AUDIT", margin + 16, sealY + 12, { lineBreak: false })

            doc.font("Regular").fontSize(7.5).fillColor(COLORS.slateLight)
                .text(
                    "A jelentést a BacklineIT automatizált diagnosztikai motorja állította össze az auditálás időpontjában elérhető hálózati, szerver és forráskód adatok alapján. További mélyreható biztonsági vagy egyedi kódolási fejlesztési igény esetén forduljon bizalommal csapatunkhoz.",
                    margin + 16,
                    sealY + 26,
                    { width: contentWidth - 32, lineGap: 2.5 }
                )

            doc.font("Bold").fontSize(8).fillColor(COLORS.cyan)
                .text("Kapcsolat: hello@backlineit.hu  |  https://backlineit.hu  |  https://backlineit.com", margin + 16, sealY + 52, { lineBreak: false })

            doc.y = sealY + 76

            // =========================================================================
            // 8. RUNNING FOOTER ON EVERY PAGE
            // =========================================================================
            const range = doc.bufferedPageRange()
            const totalPages = range.count
            for (let i = range.start; i < range.start + totalPages; i++) {
                doc.switchToPage(i)
                const prevBottom = doc.page.margins.bottom
                doc.page.margins.bottom = 0

                const footerY = pageHeight - 36
                doc.moveTo(margin, footerY - 6)
                    .lineTo(pageWidth - margin, footerY - 6)
                    .lineWidth(0.5)
                    .stroke(COLORS.borderLight)

                doc.font("Regular").fontSize(7.5).fillColor(COLORS.slateMuted)
                    .text(
                        `© ${new Date().getFullYear()} BacklineIT • Stratégiai Növekedési & Weboldal Audit • ${report.domain}`,
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
