import os
from playwright.sync_api import sync_playwright

HTML_CONTENT = """<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    font-size: 13px;
    line-height: 1.5;
  }

  .page {
    width: 210mm;
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
    padding: 16mm 18mm;
    position: relative;
    page-break-after: always;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Page 1: Cover Page */
  .cover-page {
    background: radial-gradient(circle at 85% 15%, #1e3a8a 0%, #0f172a 60%, #020617 100%);
    color: #ffffff;
    padding: 16mm 18mm;
  }

  .cover-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .brand-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    width: 38px;
    height: 38px;
    background: linear-gradient(135deg, #3b82f6, #06b6d4);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 18px;
    color: #ffffff;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
  }

  .brand-text h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 18px;
    letter-spacing: 0.8px;
    color: #ffffff;
    text-transform: uppercase;
    line-height: 1.1;
  }

  .brand-text span {
    font-size: 10px;
    color: #94a3b8;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  .ms-badge-top {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(56, 189, 248, 0.35);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    color: #f8fafc;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .ms-grid-icon {
    display: inline-grid;
    grid-template-columns: repeat(2, 6px);
    grid-gap: 2px;
  }
  .ms-sq { width: 6px; height: 6px; border-radius: 1px; }
  .ms-red { background: #f25022; }
  .ms-green { background: #7fba00; }
  .ms-blue { background: #00a4ef; }
  .ms-yellow { background: #ffb900; }

  .cover-content {
    margin: 4px 0 10px 0;
  }

  .cover-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(90deg, rgba(37,99,235,0.25), rgba(6,182,212,0.25));
    border: 1px solid rgba(56, 189, 248, 0.4);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    color: #38bdf8;
    margin-bottom: 12px;
  }

  .cover-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 29px;
    line-height: 1.2;
    font-weight: 700;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #ffffff 40%, #cbd5e1 75%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cover-subtitle {
    font-size: 12.5px;
    color: #94a3b8;
    line-height: 1.55;
    max-width: 630px;
    margin-bottom: 16px;
  }

  .cover-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    margin-top: 10px;
  }

  .cover-card {
    width: 48.5%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 12px 14px;
    box-sizing: border-box;
  }

  .cover-card.ms-card {
    background: linear-gradient(135deg, rgba(0, 164, 239, 0.12), rgba(15, 23, 42, 0.6));
    border: 1px solid rgba(56, 189, 248, 0.4);
  }

  .cover-card .icon {
    font-size: 18px;
    margin-bottom: 4px;
  }

  .cover-card h4 {
    font-size: 13px;
    font-weight: 700;
    color: #f1f5f9;
    margin-bottom: 3px;
  }

  .cover-card p {
    font-size: 11px;
    color: #94a3b8;
    line-height: 1.35;
  }

  .cover-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 12px;
    margin-top: 12px;
  }

  .author-info h5 {
    font-size: 13px;
    color: #f8fafc;
    font-weight: 700;
  }

  .author-info p {
    font-size: 11px;
    color: #64748b;
  }

  .confidential-note {
    font-size: 10.5px;
    color: #64748b;
    text-align: right;
  }

  /* Standard Page Styles */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 10px;
    margin-bottom: 16px;
  }

  .header-brand {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-brand .dot {
    width: 8px;
    height: 8px;
    background: #2563eb;
    border-radius: 50%;
  }

  .header-section {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e2e8f0;
    padding-top: 10px;
    margin-top: 16px;
    font-size: 11px;
    color: #94a3b8;
  }

  .section-title-wrap {
    margin-bottom: 14px;
  }

  .section-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.25;
  }

  .section-desc {
    font-size: 12.5px;
    color: #475569;
    margin-top: 4px;
    line-height: 1.5;
  }

  /* Two column layout */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }

  /* Feature cards */
  .card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px;
  }

  .card.highlight {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  .card.blue-highlight {
    background: #eff6ff;
    border-color: #bfdbfe;
  }

  .card.ms-highlight {
    background: #f0f9ff;
    border-color: #bae6fd;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .card-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    background: #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .card-title {
    font-size: 13.5px;
    font-weight: 700;
    color: #0f172a;
  }

  .card-text {
    font-size: 11.5px;
    color: #475569;
    line-height: 1.45;
  }

  /* Table styling */
  .custom-table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 14px 0;
    font-size: 11px;
  }

  .custom-table th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 8px 10px;
  }

  .custom-table th:first-child {
    border-top-left-radius: 8px;
  }
  .custom-table th:last-child {
    border-top-right-radius: 8px;
    text-align: right;
  }

  .custom-table td {
    padding: 8px 10px;
    border-bottom: 1px solid #e2e8f0;
    color: #334155;
  }

  .custom-table td:last-child {
    text-align: right;
    font-weight: 700;
    color: #0f172a;
  }

  .custom-table tr:nth-child(even) td {
    background: #f8fafc;
  }

  .badge-green {
    background: #dcfce7;
    color: #15803d;
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 10.5px;
    display: inline-block;
  }

  .badge-blue {
    background: #dbeafe;
    color: #1d4ed8;
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 10.5px;
    display: inline-block;
  }

  .badge-ms {
    background: #e0f2fe;
    color: #0369a1;
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 10.5px;
    display: inline-block;
  }

  /* Banner block */
  .callout-banner {
    background: linear-gradient(135deg, #1e293b, #0f172a);
    color: #ffffff;
    border-radius: 12px;
    padding: 14px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0;
  }

  .callout-banner h4 {
    font-size: 13.5px;
    font-weight: 700;
    color: #38bdf8;
    margin-bottom: 4px;
  }

  .callout-banner p {
    font-size: 11.5px;
    color: #cbd5e1;
    line-height: 1.4;
  }

  .callout-val {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #4ade80;
    text-align: right;
    white-space: nowrap;
    margin-left: 16px;
  }

  .callout-val small {
    display: block;
    font-size: 10px;
    color: #94a3b8;
    font-weight: 500;
  }

  /* List items with icons */
  .check-list {
    list-style: none;
    margin: 8px 0;
  }

  .check-list li {
    position: relative;
    padding-left: 24px;
    margin-bottom: 7px;
    font-size: 11.5px;
    color: #334155;
    line-height: 1.45;
  }

  .check-list li::before {
    content: "✓";
    position: absolute;
    left: 0;
    top: 0;
    width: 16px;
    height: 16px;
    background: #dcfce7;
    color: #16a34a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 800;
  }

  /* Roadmap Timeline */
  .timeline {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 12px 0;
  }

  .timeline-step {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-top: 3px solid #2563eb;
    border-radius: 8px;
    padding: 10px 8px;
  }

  .timeline-step.active {
    border-top-color: #10b981;
    background: #f0fdf4;
  }

  .step-num {
    font-size: 9.5px;
    font-weight: 800;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }

  .timeline-step.active .step-num {
    color: #059669;
  }

  .step-title {
    font-size: 11.5px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 3px;
  }

  .step-desc {
    font-size: 10px;
    color: #64748b;
    line-height: 1.35;
  }

  /* Quote block */
  .quote-box {
    border-left: 3px solid #2563eb;
    background: #f8fafc;
    padding: 10px 14px;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: #334155;
    font-size: 11.5px;
    line-height: 1.45;
    margin: 10px 0;
  }

  .ms-highlight-box {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 1.5px solid #7dd3fc;
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 14px;
    display: flex;
    gap: 12px;
    align-items: center;
  }

</style>
</head>
<body>

  <!-- ==================== OLDAL 1: CÍMLAP ==================== -->
  <div class="page cover-page">
    <div class="cover-top">
      <div class="brand-logo">
        <div class="logo-icon">B</div>
        <div class="brand-text">
          <h2>Backline IT</h2>
          <span>Digital & Automation Agency</span>
        </div>
      </div>
      <div class="ms-badge-top">
        <div class="ms-grid-icon">
          <div class="ms-sq ms-red"></div>
          <div class="ms-sq ms-green"></div>
          <div class="ms-sq ms-blue"></div>
          <div class="ms-sq ms-yellow"></div>
        </div>
        <span>Microsoft Által Elismert Startup</span>
      </div>
    </div>

    <div class="cover-content">
      <div class="cover-badge">
        <span>🚀</span> PARTNERI MARKETING &amp; BUSINESS DEVELOPMENT
      </div>
      <h1 class="cover-title">
        Építsünk Együtt Skálázható Ügyfélszerző Rendszert!
      </h1>
      <p class="cover-subtitle">
        Kezdő, lendületes és a <strong>Microsoft által hivatalosan elismert és támogatott tech startupként</strong> keresünk egy agilis, önálló marketing és üzletfejlesztő partnert. Nálunk nincs felesleges bürokrácia: teljesítmény- és jutalékalapon működünk 100% Home Office-ban, kiemelkedő, passzívan kumulálódó jövedelmi lehetőséggel.
      </p>

      <div class="cover-grid">
        <div class="cover-card">
          <div class="icon">🏡</div>
          <h4>100% Home Office / Távmunka</h4>
          <p>Kötetlen munkaidő, teljes földrajzi szabadság. Nem a gép előtt töltött órák, hanem a valós ügyfélszerzési eredmények számítanak.</p>
        </div>

        <div class="cover-card">
          <div class="icon">💰</div>
          <h4>15% Sikerdíj Minden Új Ügyfél Után</h4>
          <p>Kezdő startupként nálunk nincs bérplafon: azonnali 15% részesedést kapsz minden egyszeri fejlesztési és automatizálási projektből.</p>
        </div>

        <div class="cover-card">
          <div class="icon">🔄</div>
          <h4>Havi 15% Ismétlődő Jutalék</h4>
          <p>A legnagyobb aduász: havidíjas megbízásoknál (karbantartás, SLA, retainer) a 15% minden egyes hónapban jár, amíg az ügyfél nálunk van!</p>
        </div>

        <div class="cover-card ms-card">
          <div class="icon" style="display: flex; align-items: center; gap: 6px;">
            <div class="ms-grid-icon">
              <div class="ms-sq ms-red"></div>
              <div class="ms-sq ms-green"></div>
              <div class="ms-sq ms-blue"></div>
              <div class="ms-sq ms-yellow"></div>
            </div>
          </div>
          <h4>Microsoft Partneri Elismertség</h4>
          <p>Hivatalosan elismert startup program tagság: fejlett felhőinfrastruktúra (Azure, OpenAI), ami azonnali tekintélyt és bizalmat jelent az ügyfeleknek.</p>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div class="author-info">
        <h5>Backline IT Vezetőség</h5>
        <p>Kapcsolat: Török Norbert | Alapító &amp; Rendszerfejlesztő</p>
      </div>
      <div class="confidential-note">
        Bizalmas üzleti dokumentum<br>
        2026. évi partnerségi program
      </div>
    </div>
  </div>

  <!-- ==================== OLDAL 2: A DÍJAZÁSI MODELL & JÖVEDELEM ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Karrier &amp; Partnerség</div>
        <div class="header-section">1. Rész: Kompenzációs Modell</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">Transzparens &amp; Teljesítményarányos Modell</div>
        <h2 class="section-title">Hogyan Működik a 15%-os Jutalékrendszer?</h2>
        <p class="section-desc">
          Mivel kezdő tech startup vagyunk, nálunk jelenleg nincs fix alapbér – <strong>kizárólag jutalékalapon</strong> működünk. Ez azonban a te legnagyobb lehetőséged: nincs kereseti korlát, a piaci átlag (5–8%) dupláját fizetjük, és a havi megbízások révén önálló, folyamatos passzív bevételi bázist építhetsz magadnak.
        </p>
      </div>

      <div class="grid-2">
        <div class="card blue-highlight">
          <div class="card-header">
            <div class="card-icon" style="color: #2563eb;">⚡</div>
            <div class="card-title">1. Pillér: Egyszeri Jutalék (15%)</div>
          </div>
          <p class="card-text">
            Minden olyan új ügyfél és megbízás után, amit te hozol be vagy te intézel (pl. egyedi weboldal, webalkalmazás, n8n automatizáció), az ügyfél által kifizetett teljes nettó vállalási díj <strong>15%-a azonnal téged illet</strong>.
          </p>
          <div style="margin-top: 8px;">
            <span class="badge-blue">Kifizetés: Az ügyfélszámla beérkezése után 48 órán belül</span>
          </div>
        </div>

        <div class="card highlight">
          <div class="card-header">
            <div class="card-icon" style="color: #10b981;">💎</div>
            <div class="card-title">2. Pillér: Havi Ismétlődő Jutalék (15%)</div>
          </div>
          <p class="card-text">
            <strong>Ez a legnagyobb üzleti előnyöd!</strong> Ha az ügyfél havidíjas karbantartási, SLA-üzemeltetési vagy folyamatos automatizációs szerződést köt, te <strong>minden egyes hónapban megkapod a 15%-ot</strong>, amíg az ügyfél velünk van!
          </p>
          <div style="margin-top: 8px;">
            <span class="badge-green">Valódi Passzív Jövedelem (Kumulatív havi cash-flow)</span>
          </div>
        </div>
      </div>

      <div class="callout-banner">
        <div>
          <h4>A HÓGOLYÓ-EFFEKTUS: MIÉRT JOBB EZ, MINT EGY KIS FIX BÉR?</h4>
          <p>A fix bér korlátoz és plafont szab. A havi ismétlődő jutalékkal viszont nem indulsz nulláról minden hónapban: a meglévő ügyfelek folyamatosan termelik a biztos havi alapodat, miközben a technikai kiszolgálás terhe 100%-ban minket terhel.</p>
        </div>
        <div class="callout-val">
          15%
          <small>MINDEN HÓNAPBAN</small>
        </div>
      </div>

      <h3 style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 10px;">Számszerű Példák &amp; Kereseti Szimuláció</h3>
      
      <table class="custom-table">
        <thead>
          <tr>
            <th>Szolgáltatás / Projekt Típusa</th>
            <th>Ügyfél Ár (Nettó)</th>
            <th>Jutalék Típusa</th>
            <th>A Te Kereseted (15%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Egyedi Next.js Céges Weboldal</strong> (Prémium szint)</td>
            <td>850 000 Ft</td>
            <td>Egyszeri megbízás</td>
            <td><span class="badge-blue">127 500 Ft</span></td>
          </tr>
          <tr>
            <td><strong>Komplex Üzleti n8n Automatizáció</strong> (CRM, számlázás)</td>
            <td>550 000 Ft</td>
            <td>Egyszeri megbízás</td>
            <td><span class="badge-blue">82 500 Ft</span></td>
          </tr>
          <tr>
            <td><strong>Alap Havidíjas Rendszerfelügyelet &amp; Support</strong></td>
            <td>120 000 Ft / hó</td>
            <td>Havi ismétlődő</td>
            <td><span class="badge-green">18 000 Ft / hó</span></td>
          </tr>
          <tr>
            <td><strong>Prémium Havi Automatizáció &amp; SLA Retainer</strong></td>
            <td>280 000 Ft / hó</td>
            <td>Havi ismétlődő</td>
            <td><span class="badge-green">42 000 Ft / hó</span></td>
          </tr>
          <tr style="background: #f1f5f9; font-weight: 700;">
            <td colspan="3"><strong>6 hónapos cél (Pl. 8 aktív havidíjas ügyfél stabilizálása):</strong></td>
            <td><span style="color: #059669; font-size: 12.5px;">~240 000 Ft / hó BIZTOS PASSZÍV + új projektek!</span></td>
          </tr>
        </tbody>
      </table>

      <div class="quote-box">
        "Kezdő startupként a tisztességes és nyílt partnerségben hiszünk: nincs alacsony fix bér kamu ígéretekkel. Helyette olyan rendszert adunk, amivel a saját munkád gyümölcsét aratod le, a Microsoft támogatásával a hátad mögött."
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Partneri Tájékoztató</span>
      <span>2. Oldal / 4</span>
    </div>
  </div>

  <!-- ==================== OLDAL 3: MIT KÍNÁLUNK ÉS MI A FELADAT? ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Szolgáltatáskínálat &amp; Szerepkör</div>
        <div class="header-section">2. Rész: Termékek &amp; Hitelesség</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">A Termékkínálat &amp; A Piaci Erősségünk</div>
        <h2 class="section-title">Mit Képviselsz és Miért Könnyű Eladni?</h2>
        <p class="section-desc">
          Olyan modern megoldásokat értékesítesz, amelyek azonnal mérhető profitot és időmegtakarítást jelentenek a cégeknek. A piac tele van elavult WordPress oldalakkal – mi a jövő technológiáját visszük a döntéshozóknak.
        </p>
      </div>

      <!-- Microsoft Highlight Box -->
      <div class="ms-highlight-box">
        <div class="ms-grid-icon" style="transform: scale(1.4); margin-left: 6px;">
          <div class="ms-sq ms-red"></div>
          <div class="ms-sq ms-green"></div>
          <div class="ms-sq ms-blue"></div>
          <div class="ms-sq ms-yellow"></div>
        </div>
        <div style="margin-left: 8px;">
          <h4 style="font-size: 13px; font-weight: 700; color: #0284c7; margin-bottom: 2px;">
            A LEGKIEMELKEDŐBB ELŐNYÖD: MICROSOFT ÁLTAL ELISMERT STARTUP HÁTTÉR
          </h4>
          <p style="font-size: 11px; color: #334155; line-height: 1.4;">
            Nem egy névtelen „garázscéget” kell bemutatnod! A Backline IT a <strong>Microsoft hivatalos startup programjának elismert tagja</strong>, ami hozzáférést biztosít számunkra a Microsoft Azure vállalati felhőhöz és a legújabb OpenAI modellekhez. Ez az ügyfelek felé <strong>azonnali tekintélyt, stabilitást és prémium garanciát</strong> jelent a tárgyalások során.
          </p>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #2563eb;">💻</div>
            <div class="card-title">Next.js Webalkalmazások</div>
          </div>
          <p class="card-text">
            Villámgyors, egyedi szoftverek és prémium weboldalak (Netflix, Notion technológia). Nem törik fel, azonnal betölt, tökéletes mobilon, modern ügyfélportállal.
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #8b5cf6;">🤖</div>
            <div class="card-title">n8n Üzleti Automatizáció</div>
          </div>
          <p class="card-text">
            Összekötünk mindent mindennel: automata árajánlatok, számlázás (Számlázz.hu), CRM-szinkron, AI ticketek. Heti 10–20 órányi manuális gépelést spórol a cégeknek.
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #06b6d4;">🛡️</div>
            <div class="card-title">Havidíjas DevOps &amp; Support</div>
          </div>
          <p class="card-text">
            0-24 felhő monitoring, automata biztonsági mentések és havi fejlesztési rendelkezésre állás. Ez biztosítja a te havi 15%-os ismétlődő jutalékodat.
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #f59e0b;">📦</div>
            <div class="card-title">Kész Digitális Termékek</div>
          </div>
          <p class="card-text">
            Dobozos szoftverek (WooCommerce Számlázz.hu bővítmény, n8n Lead Management robot, SaaS Boilerplate) az azonnali értékesítéshez.
          </p>
        </div>
      </div>

      <h3 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 10px 0 4px 0;">A Marketing Partner Konkrét Feladatai</h3>

      <div class="card" style="background: #ffffff; border: 1.5px solid #e2e8f0; padding: 10px 14px;">
        <ul class="check-list">
          <li><strong>Potenciális ügyfelek felkutatása (Lead Generálás):</strong> Kkv-k, e-kereskedők felkutatása, akik túl sok adminisztrációval küzdenek.</li>
          <li><strong>Kapcsolatfelvétel &amp; Érdeklődésfelkeltés:</strong> LinkedIn kapcsolatépítés, B2B email megkeresések, marketing tartalomkészítés.</li>
          <li><strong>Fájdalompontok azonosítása:</strong> Hol lassú a folyamatuk? Mivel megy el feleslegesen a munkaidejük?</li>
          <li><strong>Lead átadása:</strong> NEM kell kódolnod és nem kell technikai ajánlatot írnod! A demókat, az ajánlatokat és a megvalósítást mi csináljuk.</li>
        </ul>
      </div>

      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 8px 12px; margin-top: 8px; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">💡</span>
        <span style="font-size: 11px; color: #1e40af;"><strong>A Te feladatod az ajtók kinyitása és a bizalom megalapozása.</strong> A megvalósítás, a garancia és a technikai háttér teljes egészében a mi felelősségünk.</span>
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Partneri Tájékoztató</span>
      <span>3. Oldal / 4</span>
    </div>
  </div>

  <!-- ==================== OLDAL 4: JÖVŐKÉP, TÁMOGATÁS & ONBOARDING ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Karrierút &amp; Következő Lépések</div>
        <div class="header-section">3. Rész: Növekedési Pálya</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">Jövőkép &amp; Fejlődés Együtt</div>
        <h2 class="section-title">Hogyan Növünk Együtt egy Sikeres Startupban?</h2>
        <p class="section-desc">
          Egy induló tech cég legelső marketingese nem csupán egy megbízott, hanem a cég kulcsembere. A közös munka során a sikerek arányában lépünk szintről szintre.
        </p>
      </div>

      <div class="timeline">
        <div class="timeline-step active">
          <div class="step-num">1. FÁZIS (Indulás)</div>
          <div class="step-title">100% Jutalékos Rajt</div>
          <div class="step-desc">Tiszta jutalékos modell (15% egyszeri + 15% havi). Termékek megismerése, első lezárások, gyors kifizetések.</div>
        </div>

        <div class="timeline-step">
          <div class="step-num">2. FÁZIS (2-4. Hónap)</div>
          <div class="step-title">Passzív Bázis Építés</div>
          <div class="step-desc">A havidíjas ügyfelekből stabil, havi 200–400 ezer Ft-os biztos passzív alapjövedelem kiépítése.</div>
        </div>

        <div class="timeline-step">
          <div class="step-num">3. FÁZIS (5-6. Hónap)</div>
          <div class="step-title">Marketing Büdzsé</div>
          <div class="step-desc">Céges hirdetési költségvetés (Meta, LinkedIn, Google Ads) biztosítása a saját kampányaid felskálázására.</div>
        </div>

        <div class="timeline-step">
          <div class="step-num">4. FÁZIS (Hosszú táv)</div>
          <div class="step-title">Head of Growth</div>
          <div class="step-desc">Marketing vezetői pozíció, junior értékesítők bevonása, csapatvezetés és cégérték-részesedés.</div>
        </div>
      </div>

      <h3 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 12px 0 8px 0;">Mit Kapsz Tőlünk az Első Naptól Kezdve?</h3>

      <div class="grid-2">
        <div class="card ms-highlight" style="padding: 11px 13px;">
          <h4 style="font-size: 12px; font-weight: 700; color: #0284c7; margin-bottom: 3px;">
            <span class="badge-ms" style="font-size: 9px; padding: 2px 6px; margin-right: 4px;">HITEL</span> Microsoft Partneri Referencia
          </h4>
          <p style="font-size: 11px; color: #334155; line-height: 1.4;">Hivatalos programtagság, ami megkülönböztet minket a tucatügynökségektől, és azonnali ajtókat nyit.</p>
        </div>

        <div class="card" style="padding: 11px 13px;">
          <h4 style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">📘 Értékesítői Kézikönyv &amp; Pitch Deck</h4>
          <p style="font-size: 11px; color: #475569; line-height: 1.4;">Részletes piaci leírások, kifogáskezelés, bevált sales sablonok és valós esettanulmányok.</p>
        </div>

        <div class="card" style="padding: 11px 13px;">
          <h4 style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">🖥️ Működő Demó Rendszerek</h4>
          <p style="font-size: 11px; color: #475569; line-height: 1.4;">Élő, működő n8n robotok és Next.js ügyfélportál, amit lenyűgöző formában tudsz bemutatni.</p>
        </div>

        <div class="card" style="padding: 11px 13px;">
          <h4 style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">📊 Villámgyors &amp; Átlátható Kifizetés</h4>
          <p style="font-size: 11px; color: #475569; line-height: 1.4;">Az ügyfél befizetését követő 48 órán belül átutaljuk a jutalékodat. Nincs várakozás vagy halogatás.</p>
        </div>
      </div>

      <div class="card" style="background: #f8fafc; border: 1.5px solid #cbd5e1; margin-top: 10px; padding: 12px 16px;">
        <h4 style="font-size: 12.5px; font-weight: 700; color: #0f172a; margin-bottom: 5px;">🎯 Hogyan Indulunk El? 3 Egyszerű Lépés:</h4>
        <ol style="padding-left: 18px; font-size: 11px; color: #334155; line-height: 1.5;">
          <li><strong>1. Rövid ismerkedő hívás (Google Meet):</strong> Átbeszéljük a kölcsönös elvárásokat és a kérdéseidet.</li>
          <li><strong>2. Termék &amp; Rendszer bemutató:</strong> Megmutatjuk a demókat, átadjuk az Értékesítői Kézikönyvet és a sablonokat.</li>
          <li><strong>3. Első akcióterv elindítása:</strong> Kijelöljük a legígéretesebb ügyfélszegmenst és elindítjuk az első megkereséseket!</li>
        </ol>
      </div>

      <div style="text-align: center; margin-top: 12px;">
        <p style="font-size: 12.5px; font-weight: 700; color: #0f172a;">Készen állsz arra, hogy egy Microsoft által támogatott startup kulcsembere légy?</p>
        <p style="font-size: 11.5px; color: #2563eb; font-weight: 600; margin-top: 2px;">Beszéljük meg a részleteket még a héten!</p>
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Partneri Tájékoztató</span>
      <span>4. Oldal / 4</span>
    </div>
  </div>

</body>
</html>
"""

def generate_pdf():
    output_pdf = r"c:\Users\Török Norbert\.gemini\antigravity\scratch\webpage 2.0\Marketing_Partneri_Egyuttmukodes_BacklineIT.pdf"
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(HTML_CONTENT, wait_until="networkidle")
        page.pdf(
            path=output_pdf,
            format="A4",
            print_background=True,
            margin={"top": "0mm", "right": "0mm", "bottom": "0mm", "left": "0mm"}
        )
        browser.close()
    print(f"PDF successfully generated at: {output_pdf}")

if __name__ == "__main__":
    generate_pdf()
