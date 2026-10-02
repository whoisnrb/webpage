"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    FileText, 
    UploadCloud, 
    Download, 
    Sparkles, 
    CheckCircle2, 
    Clock, 
    Building2, 
    User, 
    Receipt, 
    DollarSign, 
    AlertCircle, 
    RefreshCw, 
    Scan, 
    Copy, 
    Check, 
    Database, 
    Coins, 
    Eye, 
    Code2,
    Calendar,
    CreditCard
} from "lucide-react";

interface InvoiceData {
    vendor?: {
        name?: string | null;
        taxNumber?: string | null;
        address?: string | null;
    };
    customer?: {
        name?: string | null;
        taxNumber?: string | null;
    };
    documentDetails?: {
        type?: string;
        invoiceNumber?: string | null;
        issueDate?: string | null;
        dueDate?: string | null;
        paymentMethod?: string | null;
        currency?: string;
    };
    items?: Array<{
        name: string;
        quantity: string;
        unitPrice: string;
        vatRate: string;
        grossTotal: string;
    }>;
    totals?: {
        netTotal?: string | null;
        vatTotal?: string | null;
        grossTotal?: string | null;
    };
    confidenceScore?: string;
}

// Function to draw realistic mock receipts directly onto a canvas and export crisp PNG data URLs
function createSampleReceiptPng(type: 1 | 2 | 3): string {
    if (typeof window === "undefined") return "";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    if (type === 1) {
        // MOL Fuel / Station Receipt (Nyugta)
        canvas.width = 540;
        canvas.height = 760;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header
        ctx.fillStyle = "#111827";
        ctx.textAlign = "center";
        ctx.font = "bold 22px 'Courier New', monospace";
        ctx.fillText("MOL TÖLTŐÁLLOMÁS 142. SZ.", 270, 45);

        ctx.font = "14px 'Courier New', monospace";
        ctx.fillText("MOL Nyrt. - 1117 Budapest, Október 23. u. 18.", 270, 70);
        ctx.fillText("Adószám: 10625790-2-44", 270, 92);
        ctx.fillText("Közösségi adószám: HU10625790", 270, 112);

        // Divider
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(30, 130);
        ctx.lineTo(510, 130);
        ctx.strokeStyle = "#9ca3af";
        ctx.stroke();

        // Receipt details
        ctx.setLineDash([]);
        ctx.textAlign = "left";
        ctx.font = "13px 'Courier New', monospace";
        ctx.fillText("NYUGTA SORSZÁM: NY-2026/04192", 30, 155);
        ctx.fillText("DÁTUM: 2026.04.14 08:42", 30, 175);
        ctx.fillText("PÉNZTÁR: 02 (Kasszás: V. Tamás)", 30, 195);
        ctx.fillText("FIZETÉSI MÓD: BANKKÁRTYA (Mastercard)", 30, 215);

        // Divider
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(30, 230);
        ctx.lineTo(510, 230);
        ctx.stroke();

        // Items header
        ctx.setLineDash([]);
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillText("MEGNEVEZÉS", 30, 252);
        ctx.textAlign = "right";
        ctx.fillText("ÁFA", 340, 252);
        ctx.fillText("ÖSSZEG (HUF)", 510, 252);

        // Items
        const items = [
            { name: "EVO DIESEL PLUS", qty: "42.50 L x 619.9 Ft", vat: "27%", total: "26 346 Ft" },
            { name: "FRESH CORNER CAPPUCCINO XL", qty: "1 DB x 1 090 Ft", vat: "27%", total: "1 090 Ft" },
            { name: "ORION MOGYORÓS CSOKI 100G", qty: "2 DB x 690 Ft", vat: "27%", total: "1 380 Ft" },
            { name: "ORSZÁGOS 10 NAPOS E-MATRICA (D1)", qty: "1 DB x 6 400 Ft", vat: "27%", total: "6 400 Ft" }
        ];

        let y = 285;
        items.forEach((item) => {
            ctx.textAlign = "left";
            ctx.font = "bold 13px 'Courier New', monospace";
            ctx.fillText(item.name, 30, y);
            ctx.font = "12px 'Courier New', monospace";
            ctx.fillText(item.qty, 30, y + 18);

            ctx.textAlign = "right";
            ctx.font = "13px 'Courier New', monospace";
            ctx.fillText(item.vat, 340, y + 10);
            ctx.font = "bold 14px 'Courier New', monospace";
            ctx.fillText(item.total, 510, y + 10);
            y += 42;
        });

        // Totals divider
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(30, y + 10);
        ctx.lineTo(510, y + 10);
        ctx.stroke();

        y += 35;
        ctx.setLineDash([]);
        ctx.textAlign = "left";
        ctx.font = "14px 'Courier New', monospace";
        ctx.fillText("Nettó összeg (27%):", 30, y);
        ctx.textAlign = "right";
        ctx.fillText("27 730 Ft", 510, y);

        y += 24;
        ctx.textAlign = "left";
        ctx.fillText("ÁFA érték (27%):", 30, y);
        ctx.textAlign = "right";
        ctx.fillText("7 486 Ft", 510, y);

        y += 30;
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(25, y - 18, 490, 42);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px 'Courier New', monospace";
        ctx.textAlign = "left";
        ctx.fillText("FIZETENDŐ VÉGÖSSZEG:", 35, y + 10);
        ctx.textAlign = "right";
        ctx.fillText("35 216 HUF", 505, y + 10);

        // Barcode simulation
        y += 65;
        ctx.fillStyle = "#111827";
        ctx.textAlign = "center";
        ctx.font = "11px 'Courier New', monospace";
        ctx.fillText("NAV ELLENŐRZŐ KÓD: 492A-E910-C311-B892", 270, y);

        for (let i = 0; i < 60; i++) {
            const barW = (i % 3 === 0) ? 4 : (i % 2 === 0 ? 2 : 1);
            ctx.fillRect(110 + i * 5, y + 15, barW, 40);
        }

        ctx.font = "11px 'Courier New', monospace";
        ctx.fillText("KÖSZÖNJÜK A VÁSÁRLÁST! JÓ UTAT KÍVÁNUNK!", 270, y + 75);

    } else if (type === 2) {
        // Construction Invoice (Építőipar Számla)
        canvas.width = 640;
        canvas.height = 800;

        ctx.fillStyle = "#fcfdfd";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Border
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.strokeRect(15, 15, 610, 770);

        // Header
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("SZÁMLA", 35, 55);

        ctx.font = "bold 13px sans-serif";
        ctx.fillStyle = "#2563eb";
        ctx.fillText("SZÁMLASZÁM: BM-2026/00482", 35, 78);

        // Vendor & Customer Box
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(35, 95, 275, 125);
        ctx.fillRect(330, 95, 275, 125);

        // Vendor Info
        ctx.fillStyle = "#475569";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("KIÁLLÍTÓ (SZÁLLÍTÓ):", 45, 115);
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("Bau-Master Generál Kft.", 45, 135);
        ctx.font = "12px sans-serif";
        ctx.fillText("1095 Budapest, Mester u. 42.", 45, 155);
        ctx.fillText("Adószám: 24891024-2-43", 45, 175);
        ctx.fillText("Bankszámla: 11709002-20593411", 45, 195);

        // Customer Info
        ctx.fillStyle = "#475569";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("VEVŐ (MEGRENDELŐ):", 340, 115);
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("Horváth & Társai Ingatlan Kft.", 340, 135);
        ctx.font = "12px sans-serif";
        ctx.fillText("2040 Budaörs, Raktárváros u. 8.", 340, 155);
        ctx.fillText("Adószám: 18402914-2-13", 340, 175);
        ctx.fillText("Fizetési mód: Átutalás (8 nap)", 340, 195);

        // Dates Row
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(35, 235, 570, 36);
        ctx.fillStyle = "#475569";
        ctx.font = "12px sans-serif";
        ctx.fillText("Kiállítás: 2026.04.10", 45, 258);
        ctx.fillText("Teljesítés: 2026.04.08", 240, 258);
        ctx.fillText("Fizetési határidő: 2026.04.18", 420, 258);

        // Table Header
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(35, 285, 570, 32);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText("TÉTEL MEGNEVEZÉSE", 45, 305);
        ctx.textAlign = "right";
        ctx.fillText("MENNY.", 360, 305);
        ctx.fillText("EGYSÉGÁR", 460, 305);
        ctx.fillText("BRUTTÓ", 590, 305);

        // Table Rows
        const cItems = [
            { name: "Rigips Pro gipszkarton lap (12.5mm)", qty: "85 tábla", price: "2 450 Ft", gross: "264 416 Ft" },
            { name: "Knauf CD/UD horganyzott profil 4m", qty: "40 szál", price: "1 890 Ft", gross: "96 012 Ft" },
            { name: "Héra prémium belső falfesték (fehér, 15L)", qty: "6 vödör", price: "18 900 Ft", gross: "144 018 Ft" },
            { name: "Gipszkartonozási és szerelési munkadíj", qty: "32 munkaóra", price: "7 500 Ft", gross: "304 800 Ft" }
        ];

        let cy = 340;
        cItems.forEach((item, idx) => {
            ctx.fillStyle = idx % 2 === 0 ? "#f8fafc" : "#ffffff";
            ctx.fillRect(35, cy - 20, 570, 34);

            ctx.fillStyle = "#0f172a";
            ctx.textAlign = "left";
            ctx.font = "12px sans-serif";
            ctx.fillText(item.name, 45, cy);

            ctx.textAlign = "right";
            ctx.fillText(item.qty, 360, cy);
            ctx.fillText(item.price, 460, cy);
            ctx.font = "bold 12px sans-serif";
            ctx.fillText(item.gross, 590, cy);

            cy += 36;
        });

        // Totals Box
        cy += 40;
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(340, cy, 265, 120);

        ctx.fillStyle = "#475569";
        ctx.font = "13px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Nettó részösszeg:", 355, cy + 28);
        ctx.fillText("ÁFA érték (27%):", 355, cy + 56);

        ctx.textAlign = "right";
        ctx.fillText("637 200 HUF", 590, cy + 28);
        ctx.fillText("172 046 HUF", 590, cy + 56);

        ctx.fillStyle = "#1e40af";
        ctx.fillRect(340, cy + 72, 265, 48);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Bruttó végösszeg:", 355, cy + 102);
        ctx.textAlign = "right";
        ctx.fillText("809 246 HUF", 590, cy + 102);

        // Footer Stamp simulation
        ctx.textAlign = "left";
        ctx.strokeStyle = "#1d4ed8";
        ctx.lineWidth = 2;
        ctx.strokeRect(45, cy + 20, 180, 80);
        ctx.fillStyle = "#1d4ed8";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("BAU-MASTER KFT.", 60, cy + 45);
        ctx.font = "9px sans-serif";
        ctx.fillText("P.H. Hivatalos bizonylat", 60, cy + 65);
        ctx.fillText("Köszönjük megrendelését!", 60, cy + 85);

    } else {
        // Tech & Hardware Invoice (IT Eszközök Számla)
        canvas.width = 620;
        canvas.height = 780;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header Banner
        ctx.fillStyle = "#047857";
        ctx.fillRect(0, 0, canvas.width, 10);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 22px 'Segoe UI', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("NovaTech Systems Kft.", 35, 50);

        ctx.font = "12px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#64748b";
        ctx.fillText("H-1134 Budapest, Váci út 47/B | Tel: +36 1 450 8890", 35, 70);
        ctx.fillText("Adószám: 26391083-2-41 | EU adószám: HU26391083", 35, 88);

        ctx.textAlign = "right";
        ctx.fillStyle = "#047857";
        ctx.font = "bold 18px 'Segoe UI', sans-serif";
        ctx.fillText("E-SZÁMLA", 585, 50);
        ctx.fillStyle = "#0f172a";
        ctx.font = "13px 'Segoe UI', sans-serif";
        ctx.fillText("Számlaszám: NV-2026/8910", 585, 72);
        ctx.fillText("Kelt: 2026.04.12", 585, 90);

        // Divider
        ctx.strokeStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.moveTo(35, 110);
        ctx.lineTo(585, 110);
        ctx.stroke();

        // Customer details
        ctx.textAlign = "left";
        ctx.fillStyle = "#64748b";
        ctx.font = "bold 11px 'Segoe UI', sans-serif";
        ctx.fillText("VEVŐ ADATAI:", 35, 132);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 14px 'Segoe UI', sans-serif";
        ctx.fillText("Apex Media Digital Kft.", 35, 152);
        ctx.font = "12px 'Segoe UI', sans-serif";
        ctx.fillText("1052 Budapest, Deák Ferenc tér 3.", 35, 172);
        ctx.fillText("Adószám: 19582041-2-41", 35, 192);

        ctx.textAlign = "right";
        ctx.fillText("Fizetési mód: Banki átutalás", 585, 152);
        ctx.fillText("Fizetési határidő: 2026.04.22", 585, 172);
        ctx.fillText("Pénznem: HUF", 585, 192);

        // Table Header
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(35, 215, 550, 30);
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 11px 'Segoe UI', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("CIKKSZÁM / TERMÉK MEGNEVEZÉSE", 45, 235);
        ctx.textAlign = "right";
        ctx.fillText("MENNY.", 350, 235);
        ctx.fillText("NETTÓ ÁR", 450, 235);
        ctx.fillText("BRUTTÓ ÁR", 575, 235);

        const itItems = [
            { desc: "Dell UltraSharp 27 4K Monitor (U2723QE)", qty: "2 db", net: "179 900 Ft", gross: "456 946 Ft" },
            { desc: "Logitech MX Master 3S Wireless Egér", qty: "2 db", net: "34 900 Ft", gross: "88 646 Ft" },
            { desc: "Apple Magic Keyboard Touch ID-val", qty: "2 db", net: "49 900 Ft", gross: "126 746 Ft" },
            { desc: "Cat6A S/FTP Hálózati patch kábel (5m)", qty: "5 db", net: "2 400 Ft", gross: "15 240 Ft" }
        ];

        let ty = 275;
        itItems.forEach((item) => {
            ctx.textAlign = "left";
            ctx.font = "12px 'Segoe UI', sans-serif";
            ctx.fillStyle = "#0f172a";
            ctx.fillText(item.desc, 45, ty);

            ctx.textAlign = "right";
            ctx.fillText(item.qty, 350, ty);
            ctx.fillText(item.net, 450, ty);
            ctx.font = "bold 12px 'Segoe UI', sans-serif";
            ctx.fillText(item.gross, 575, ty);

            ty += 38;
        });

        // Totals
        ty += 30;
        ctx.fillStyle = "#047857";
        ctx.fillRect(350, ty, 235, 115);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.font = "12px 'Segoe UI', sans-serif";
        ctx.fillText("Nettó összeg:", 365, ty + 28);
        ctx.fillText("ÁFA tartalom (27%):", 365, ty + 56);

        ctx.textAlign = "right";
        ctx.fillText("541 400 Ft", 570, ty + 28);
        ctx.fillText("146 178 Ft", 570, ty + 56);

        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath();
        ctx.moveTo(365, ty + 70);
        ctx.lineTo(570, ty + 70);
        ctx.stroke();

        ctx.font = "bold 15px 'Segoe UI', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Fizetendő:", 365, ty + 96);
        ctx.textAlign = "right";
        ctx.fillText("687 578 Ft", 570, ty + 96);

        // Security seal
        ctx.textAlign = "left";
        ctx.fillStyle = "#64748b";
        ctx.font = "10px 'Segoe UI', sans-serif";
        ctx.fillText("Elektronikus számla. Hitelesítve az eIDAS rendelet szerint.", 35, ty + 40);
        ctx.fillText("A számla a NAV Online Számla rendszerébe beküldve.", 35, ty + 56);
        ctx.fillText("Hash: 8f9b2c3a10e8d721fa44b091873210aa983f", 35, ty + 72);
    }

    return canvas.toDataURL("image/png");
}

export function InvoiceVisionDemo({ locale = "hu" }: { locale?: string }) {
    const isEn = locale === "en";

    // Pre-generated sample images stored as base64 PNG data URLs
    const [samples, setSamples] = useState<{ [key: number]: string }>({});
    const [activeSample, setActiveSample] = useState<number>(1);
    const [currentImage, setCurrentImage] = useState<string>("");
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [analysisStage, setAnalysisStage] = useState<string>("");
    const [result, setResult] = useState<InvoiceData | null>(null);
    const [usageStats, setUsageStats] = useState<{ totalTokens: number; approxHuf: string }>({
        totalTokens: 0,
        approxHuf: "0.00"
    });
    const [elapsedTime, setElapsedTime] = useState<string>("1.6");
    const [showRawJson, setShowRawJson] = useState<boolean>(false);
    const [copiedJson, setCopiedJson] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize sample PNGs on client mount
    useEffect(() => {
        const s1 = createSampleReceiptPng(1);
        const s2 = createSampleReceiptPng(2);
        const s3 = createSampleReceiptPng(3);
        setSamples({ 1: s1, 2: s2, 3: s3 });
        setCurrentImage(s1);
    }, []);

    // Handle sample switch
    const handleSelectSample = (sampleId: number) => {
        setActiveSample(sampleId);
        if (samples[sampleId]) {
            setCurrentImage(samples[sampleId]);
            setResult(null);
            setErrorMsg(null);
        }
    };

    // Handle user image upload & client-side compression
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const rawDataUrl = event.target?.result as string;
            if (!rawDataUrl) return;

            // Compress / resize image with canvas to avoid giant payload
            const img = new Image();
            img.onload = () => {
                const maxDimension = 1400;
                let width = img.width;
                let height = img.height;

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    } else {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
                    setCurrentImage(compressedDataUrl);
                    setActiveSample(0); // custom
                    setResult(null);
                    setErrorMsg(null);
                }
            };
            img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
    };

    // Analyze document with Azure OpenAI GPT-4o Vision
    const handleAnalyze = async () => {
        if (!currentImage || isAnalyzing) return;

        setIsAnalyzing(true);
        setErrorMsg(null);
        setAnalysisStage(isEn ? "Preparing image & resolution..." : "Kép optimalizálása & felbontás...");

        const startTime = Date.now();

        try {
            setTimeout(() => {
                setAnalysisStage(isEn ? "Azure GPT-4o Vision OCR inference..." : "Azure GPT-4o Vision OCR futtatása...");
            }, 600);

            setTimeout(() => {
                setAnalysisStage(isEn ? "Parsing itemized tables & tax structures..." : "Tételek és adószámok strukturálása...");
            }, 1200);

            const res = await fetch("/api/demo/invoice-vision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: currentImage,
                    locale
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || (isEn ? "Document analysis failed" : "A számla elemzése sikertelen"));
            }

            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            setElapsedTime(duration);
            setResult(data.data);

            if (data.usage) {
                setUsageStats({
                    totalTokens: data.usage.totalTokens,
                    approxHuf: data.usage.approxCostHuf
                });
            }

        } catch (err: any) {
            console.error("Analysis error:", err);
            setErrorMsg(err.message || (isEn ? "An unexpected error occurred." : "Váratlan hiba történt a feldolgozás során."));
        } finally {
            setIsAnalyzing(false);
            setAnalysisStage("");
        }
    };

    // Export to CSV (Excel compatible with UTF-8 BOM)
    const handleExportCsv = () => {
        if (!result) return;

        let csv = "\uFEFF"; // UTF-8 BOM for Excel
        csv += `${isEn ? "Item description" : "Tétel megnevezése"};${isEn ? "Quantity" : "Mennyiség"};${isEn ? "Unit price" : "Egységár"};${isEn ? "VAT" : "ÁFA"};${isEn ? "Gross total" : "Bruttó összeg"}\r\n`;

        result.items?.forEach((item) => {
            csv += `"${item.name || ""}";"${item.quantity || ""}";"${item.unitPrice || ""}";"${item.vatRate || ""}";"${item.grossTotal || ""}"\r\n`;
        });

        csv += `\r\n`;
        csv += `${isEn ? "Vendor" : "Szállító"};"${result.vendor?.name || ""}"\r\n`;
        csv += `${isEn ? "Vendor Tax ID" : "Szállító adószáma"};"${result.vendor?.taxNumber || ""}"\r\n`;
        csv += `${isEn ? "Customer" : "Vevő"};"${result.customer?.name || ""}"\r\n`;
        csv += `${isEn ? "Invoice Number" : "Számlaszám"};"${result.documentDetails?.invoiceNumber || ""}"\r\n`;
        csv += `${isEn ? "Date" : "Kelt"};"${result.documentDetails?.issueDate || ""}"\r\n`;
        csv += `${isEn ? "Net Total" : "Nettó összeg"};"${result.totals?.netTotal || ""}"\r\n`;
        csv += `${isEn ? "VAT Total" : "ÁFA érték"};"${result.totals?.vatTotal || ""}"\r\n`;
        csv += `${isEn ? "Gross Total" : "Bruttó végösszeg"};"${result.totals?.grossTotal || ""}"\r\n`;

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const filename = `backline_invoice_${result.documentDetails?.invoiceNumber || "export"}.csv`.replace(/[\/\s]/g, "_");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Copy JSON to clipboard
    const handleCopyJson = () => {
        if (!result) return;
        navigator.clipboard.writeText(JSON.stringify(result, null, 2));
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Top Toolbar: Sample Pickers & Upload */}
            <div className="bg-card border rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                                {isEn ? "Step 1: Choose a Sample or Upload Your Own Receipt" : "1. Lépés: Válasszon mintát vagy töltsön fel saját számlát"}
                            </h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isEn 
                                ? "Test with high-contrast Hungarian receipts or upload a real invoice/fuel voucher." 
                                : "Kattintson az előre betöltött mintákra, vagy húzza be saját számláját/blokkját!"}
                        </p>
                    </div>

                    {/* Quick sample pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleSelectSample(1)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                                activeSample === 1 
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                    : "bg-muted/60 hover:bg-muted text-muted-foreground border-border"
                            }`}
                        >
                            <span>⛽</span>
                            <span>{isEn ? "MOL Fuel Receipt" : "1. MOL Blokk (Üzemanyag)"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSelectSample(2)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                                activeSample === 2 
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                    : "bg-muted/60 hover:bg-muted text-muted-foreground border-border"
                            }`}
                        >
                            <span>🏗️</span>
                            <span>{isEn ? "Construction Invoice" : "2. Építőipari Számla"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSelectSample(3)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                                activeSample === 3 
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                    : "bg-muted/60 hover:bg-muted text-muted-foreground border-border"
                            }`}
                        >
                            <span>💻</span>
                            <span>{isEn ? "Hardware / IT Invoice" : "3. Irodatechnikai Számla"}</span>
                        </button>

                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden" 
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                                activeSample === 0 
                                    ? "bg-primary text-primary-foreground border-primary" 
                                    : "bg-muted/40 hover:bg-muted text-foreground border-dashed border-primary/40 hover:border-primary"
                            }`}
                        >
                            <UploadCloud className="w-3.5 h-3.5 text-primary" />
                            <span>{isEn ? "Upload Own File..." : "Saját kép feltöltése..."}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Error banner */}
            {errorMsg && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                        <strong>{isEn ? "Error during processing:" : "Hiba a feldolgozás során:"}</strong> {errorMsg}
                    </div>
                </div>
            )}

            {/* Main Interactive Work Area: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT COLUMN: Document Preview & Scanner Trigger */}
                <div className="lg:col-span-5 space-y-4">
                    <Card className="overflow-hidden border-2 border-border shadow-md">
                        <CardHeader className="py-3 px-4 bg-muted/40 border-b flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                                    {isEn ? "Input Document Preview" : "Bemeneti Dokumentum"}
                                </span>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-mono">
                                {activeSample === 0 ? (isEn ? "Uploaded" : "Feltöltött") : `Sample #${activeSample}`}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-0 relative bg-slate-950 flex items-center justify-center min-h-[460px] max-h-[580px] overflow-hidden">
                            {currentImage ? (
                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    <img 
                                        src={currentImage} 
                                        alt="Invoice Document Preview" 
                                        className="max-h-[520px] w-auto object-contain rounded shadow-lg border border-slate-800"
                                    />

                                    {/* Animated Scan Line Overlay */}
                                    {isAnalyzing && (
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[scan_2s_ease-in-out_infinite]" />
                                            <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px] animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center p-8 text-muted-foreground">
                                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p className="text-xs">{isEn ? "No document selected" : "Nincs kiválasztott dokumentum"}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Scan Trigger Button */}
                    <Button 
                        size="lg"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !currentImage}
                        className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-primary/20 transition-all bg-gradient-to-r from-primary to-blue-600 hover:from-primary/95 hover:to-blue-600/95"
                    >
                        {isAnalyzing ? (
                            <>
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin text-white" />
                                <span>{analysisStage || (isEn ? "Processing..." : "Feldolgozás folyamatban...")}</span>
                            </>
                        ) : (
                            <>
                                <Scan className="w-5 h-5 mr-2 text-white" />
                                <span>{isEn ? "Run Azure GPT-4o Vision OCR" : "Dokumentum Elemzése (GPT-4o Vision)"}</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* RIGHT COLUMN: Extracted Structured Data */}
                <div className="lg:col-span-7 space-y-4">
                    <Card className="border shadow-md">
                        <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span>{isEn ? "Structured Extraction Results" : "Kinyert Strukturált Adatok"}</span>
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {isEn 
                                        ? "Instantly structured into JSON and enterprise ERP entities" 
                                        : "Azonnali JSON entitások számlázó és ERP rendszerekhez"}
                                </CardDescription>
                            </div>

                            {result && (
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        {result.confidenceScore || "99.4%"}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                                        {elapsedTime}s
                                    </Badge>
                                </div>
                            )}
                        </CardHeader>

                        <CardContent className="p-6">
                            {!result && !isAnalyzing && (
                                <div className="text-center py-16 px-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Scan className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2">
                                        {isEn ? "Ready for Instant OCR Extraction" : "Készen áll az azonnali OCR elemzésre"}
                                    </h4>
                                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                                        {isEn 
                                            ? "Click the button on the left to let Azure GPT-4o Vision process the document and extract tax numbers, line items, and totals." 
                                            : "Kattintson a bal oldali 'Dokumentum Elemzése' gombra a bemutató futtatásához! A rendszer felismeri a tételeket, ÁFA kulcsokat és adószámokat."}
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        onClick={handleAnalyze}
                                        className="font-medium"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2 text-primary" />
                                        {isEn ? "Analyze Selected Document" : "Kiválasztott minta elemzése"}
                                    </Button>
                                </div>
                            )}

                            {isAnalyzing && (
                                <div className="text-center py-20 px-4 space-y-4">
                                    <div className="relative w-16 h-16 mx-auto">
                                        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                        <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-base">
                                            {analysisStage}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {isEn 
                                                ? "Microsoft Azure OpenAI Vision is reading line items & metadata..." 
                                                : "A Microsoft Azure OpenAI Vision modell olvassa a tételeket és metaadatokat..."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {result && !isAnalyzing && (
                                <div className="space-y-6">
                                    {/* Vendor & Customer Summary Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Vendor */}
                                        <div className="p-3.5 rounded-xl bg-muted/40 border space-y-2">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                <Building2 className="w-3.5 h-3.5 text-primary" />
                                                <span>{isEn ? "Vendor / Issuer" : "Kiállító (Szállító)"}</span>
                                            </div>
                                            <div className="font-bold text-sm text-foreground">
                                                {result.vendor?.name || (isEn ? "Unknown" : "Ismeretlen")}
                                            </div>
                                            <div className="text-xs space-y-0.5 text-muted-foreground">
                                                {result.vendor?.taxNumber && (
                                                    <div><strong>{isEn ? "Tax ID:" : "Adószám:"}</strong> {result.vendor.taxNumber}</div>
                                                )}
                                                {result.vendor?.address && (
                                                    <div><strong>{isEn ? "Address:" : "Cím:"}</strong> {result.vendor.address}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Customer */}
                                        <div className="p-3.5 rounded-xl bg-muted/40 border space-y-2">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                <User className="w-3.5 h-3.5 text-blue-500" />
                                                <span>{isEn ? "Customer / Buyer" : "Vevő (Megrendelő)"}</span>
                                            </div>
                                            <div className="font-bold text-sm text-foreground">
                                                {result.customer?.name || (isEn ? "Private Customer / Walk-in" : "Magánszemély / Készpénzes vásárló")}
                                            </div>
                                            <div className="text-xs space-y-0.5 text-muted-foreground">
                                                {result.customer?.taxNumber ? (
                                                    <div><strong>{isEn ? "Tax ID:" : "Adószám:"}</strong> {result.customer.taxNumber}</div>
                                                ) : (
                                                    <div className="italic">{isEn ? "No buyer tax ID required" : "Nem szerepel vevői adószám"}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Details Strip */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs">
                                        <div>
                                            <span className="text-muted-foreground block text-[11px]">{isEn ? "Doc Type:" : "Bizonylat:"}</span>
                                            <strong className="text-foreground">{result.documentDetails?.type || (isEn ? "Invoice" : "Számla")}</strong>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block text-[11px]">{isEn ? "Doc #:" : "Bizonylatszám:"}</span>
                                            <strong className="text-foreground">{result.documentDetails?.invoiceNumber || "-"}</strong>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block text-[11px]">{isEn ? "Issue Date:" : "Kiállítás:"}</span>
                                            <strong className="text-foreground">{result.documentDetails?.issueDate || "-"}</strong>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block text-[11px]">{isEn ? "Payment:" : "Fizetés:"}</span>
                                            <strong className="text-foreground">{result.documentDetails?.paymentMethod || (isEn ? "Card / Cash" : "Kártya / Kp")}</strong>
                                        </div>
                                    </div>

                                    {/* Line Items Table */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                {isEn ? "Extracted Line Items" : "Feldolgozott Tételek"} ({result.items?.length || 0})
                                            </span>
                                        </div>
                                        <div className="border rounded-xl overflow-hidden bg-card">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs text-left">
                                                    <thead className="bg-muted/70 text-muted-foreground font-semibold border-b">
                                                        <tr>
                                                            <th className="p-2.5">{isEn ? "Description" : "Megnevezés"}</th>
                                                            <th className="p-2.5 text-right">{isEn ? "Qty" : "Menny."}</th>
                                                            <th className="p-2.5 text-right">{isEn ? "Unit Price" : "Egységár"}</th>
                                                            <th className="p-2.5 text-right">{isEn ? "VAT" : "ÁFA"}</th>
                                                            <th className="p-2.5 text-right font-bold">{isEn ? "Gross" : "Bruttó"}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {result.items?.map((item, idx) => (
                                                            <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                                                <td className="p-2.5 font-medium">{item.name}</td>
                                                                <td className="p-2.5 text-right text-muted-foreground">{item.quantity}</td>
                                                                <td className="p-2.5 text-right text-muted-foreground">{item.unitPrice}</td>
                                                                <td className="p-2.5 text-right text-muted-foreground">{item.vatRate}</td>
                                                                <td className="p-2.5 text-right font-bold text-foreground">{item.grossTotal}</td>
                                                            </tr>
                                                        ))}
                                                        {(!result.items || result.items.length === 0) && (
                                                            <tr>
                                                                <td colSpan={5} className="p-4 text-center text-muted-foreground italic">
                                                                    {isEn ? "No itemized lines detected" : "Nem sikerült külön tételeket elkülöníteni"}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Totals Box */}
                                    <div className="p-4 rounded-xl bg-muted/60 border space-y-2">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{isEn ? "Net Total:" : "Nettó részösszeg:"}</span>
                                            <span className="font-mono font-medium">{result.totals?.netTotal || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{isEn ? "VAT Total:" : "ÁFA érték:"}</span>
                                            <span className="font-mono font-medium">{result.totals?.vatTotal || "-"}</span>
                                        </div>
                                        <div className="pt-2 border-t flex items-center justify-between text-sm">
                                            <span className="font-bold text-foreground">{isEn ? "Final Gross Payable:" : "Fizetendő Bruttó Végösszeg:"}</span>
                                            <span className="font-mono font-bold text-base text-primary">{result.totals?.grossTotal || "-"}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons: CSV Export & Raw JSON Toggle */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleExportCsv}
                                            className="text-xs font-semibold gap-1.5 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>{isEn ? "Export to CSV (Excel)" : "Letöltés CSV formátumban (Excel)"}</span>
                                        </Button>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCopyJson}
                                                className="text-xs text-muted-foreground hover:text-foreground gap-1"
                                            >
                                                {copiedJson ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span>{isEn ? "Copied!" : "Másolva!"}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5" />
                                                        <span>{isEn ? "Copy JSON" : "JSON Másolása"}</span>
                                                    </>
                                                )}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowRawJson(!showRawJson)}
                                                className="text-xs text-muted-foreground hover:text-foreground gap-1"
                                            >
                                                <Code2 className="w-3.5 h-3.5" />
                                                <span>{showRawJson ? (isEn ? "Hide JSON" : "JSON elrejtése") : (isEn ? "Raw JSON" : "Nyers JSON")}</span>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Raw JSON viewer */}
                                    {showRawJson && (
                                        <div className="p-3 bg-slate-950 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto max-h-60 border border-slate-800">
                                            <pre>{JSON.stringify(result, null, 2)}</pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Infrastructure & Cost Monitor (Azure Credit Proof) */}
                    <Card className="bg-muted/30 border">
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
                                <span>{isEn ? "Infrastructure & Azure Cost" : "Infrastruktúra & Azure Költség"}</span>
                                <Badge variant="secondary" className="text-[10px]">Azure Sweden Central (GPT-4o Vision)</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0 grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-background rounded-lg border">
                                <div className="text-xl font-bold font-mono">
                                    {usageStats.totalTokens > 0 ? usageStats.totalTokens : "~650"}
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                    {isEn ? "Vision tokens processed" : "Feldolgozott token"}
                                </div>
                            </div>
                            <div className="p-3 bg-background rounded-lg border">
                                <div className="text-xl font-bold font-mono text-emerald-600">
                                    ~{usageStats.approxHuf !== "0.00" ? usageStats.approxHuf : "0.91"} Ft
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                    {isEn ? "Covered by Azure credit ($0 card cost)" : "Azure kreditből fedezve (0 Ft bankkártya)"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
