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
    font-size: 11px;
    line-height: 1.45;
  }

  .page {
    width: 210mm;
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
    padding: 13mm 15mm;
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
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(56, 189, 248, 0.4);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 10.5px;
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
    font-size: 28px;
    line-height: 1.2;
    font-weight: 700;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #ffffff 40%, #cbd5e1 75%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cover-subtitle {
    font-size: 12px;
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
    font-size: 12.5px;
    font-weight: 700;
    color: #f1f5f9;
    margin-bottom: 3px;
  }

  .cover-card p {
    font-size: 10.5px;
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
    font-size: 12.5px;
    color: #f8fafc;
    font-weight: 700;
  }

  .author-info p {
    font-size: 10.5px;
    color: #64748b;
  }

  .confidential-note {
    font-size: 10px;
    color: #64748b;
    text-align: right;
  }

  /* Standard Header & Footer */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 8px;
    margin-bottom: 12px;
  }

  .header-brand {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-brand .dot {
    width: 7px;
    height: 7px;
    background: #2563eb;
    border-radius: 50%;
  }

  .header-section {
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e2e8f0;
    padding-top: 8px;
    margin-top: 12px;
    font-size: 10px;
    color: #94a3b8;
  }

  .section-title-wrap {
    margin-bottom: 12px;
  }

  .section-tag {
    display: inline-block;
    font-size: 10px;
    font-weight: 800;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 3px;
  }

  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 19px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.25;
  }

  .section-desc {
    font-size: 11.5px;
    color: #475569;
    margin-top: 3px;
    line-height: 1.45;
  }

  /* Grids and Cards */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 11px;
    margin-bottom: 11px;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 11px;
  }

  .card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px;
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

  .card.dark {
    background: #0f172a;
    color: #ffffff;
    border-color: #1e293b;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .card-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  .card-title {
    font-size: 12.5px;
    font-weight: 700;
    color: #0f172a;
  }

  .card.dark .card-title {
    color: #f8fafc;
  }

  .card-text {
    font-size: 10.5px;
    color: #475569;
    line-height: 1.45;
  }

  .card.dark .card-text {
    color: #cbd5e1;
  }

  /* Table styling */
  .custom-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px 0;
    font-size: 10px;
  }

  .custom-table th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 7px 9px;
  }

  .custom-table th:first-child { border-top-left-radius: 6px; }
  .custom-table th:last-child { border-top-right-radius: 6px; text-align: right; }

  .custom-table td {
    padding: 7px 9px;
    border-bottom: 1px solid #e2e8f0;
    color: #334155;
  }

  .custom-table td:last-child {
    text-align: right;
    font-weight: 700;
    color: #0f172a;
  }

  .custom-table tr:nth-child(even) td { background: #f8fafc; }

  .badge-green {
    background: #dcfce7;
    color: #15803d;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 9.5px;
    display: inline-block;
  }

  .badge-blue {
    background: #dbeafe;
    color: #1d4ed8;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 9.5px;
    display: inline-block;
  }

  .badge-ms {
    background: #e0f2fe;
    color: #0369a1;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 9.5px;
    display: inline-block;
  }

  .badge-amber {
    background: #fef3c7;
    color: #b45309;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 9.5px;
    display: inline-block;
  }

  /* Banner block */
  .callout-banner {
    background: linear-gradient(135deg, #1e293b, #0f172a);
    color: #ffffff;
    border-radius: 10px;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
  }

  .callout-banner h4 {
    font-size: 12.5px;
    font-weight: 700;
    color: #38bdf8;
    margin-bottom: 3px;
  }

  .callout-banner p {
    font-size: 10.5px;
    color: #cbd5e1;
    line-height: 1.4;
  }

  .callout-val {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #4ade80;
    text-align: right;
    white-space: nowrap;
    margin-left: 14px;
  }

  .callout-val small {
    display: block;
    font-size: 9px;
    color: #94a3b8;
    font-weight: 500;
  }

  /* Script Box */
  .script-box {
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-left: 4px solid #2563eb;
    border-radius: 6px;
    padding: 10px 12px;
    margin: 8px 0;
    font-family: monospace, sans-serif;
    font-size: 10px;
    color: #1e293b;
    line-height: 1.45;
  }

  .script-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800;
    font-size: 10.5px;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  /* List items with icons */
  .check-list {
    list-style: none;
    margin: 6px 0;
  }

  .check-list li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 6px;
    font-size: 10.5px;
    color: #334155;
    line-height: 1.4;
  }

  .check-list li::before {
    content: "✓";
    position: absolute;
    left: 0;
    top: 0;
    width: 14px;
    height: 14px;
    background: #dcfce7;
    color: #16a34a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 800;
  }

  /* Timeline */
  .timeline {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin: 10px 0;
  }

  .timeline-step {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-top: 3px solid #2563eb;
    border-radius: 6px;
    padding: 9px 8px;
  }

  .timeline-step.active {
    border-top-color: #10b981;
    background: #f0fdf4;
  }

  .step-num {
    font-size: 9px;
    font-weight: 800;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }

  .timeline-step.active .step-num { color: #059669; }

  .step-title {
    font-size: 10.5px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 2px;
  }

  .step-desc {
    font-size: 9.5px;
    color: #64748b;
    line-height: 1.35;
  }

  .quote-box {
    border-left: 3px solid #2563eb;
    background: #f8fafc;
    padding: 9px 12px;
    border-radius: 0 6px 6px 0;
    font-style: italic;
    color: #334155;
    font-size: 10.5px;
    line-height: 1.45;
    margin: 8px 0;
  }

  .ms-highlight-box {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 1.5px solid #7dd3fc;
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
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
        <span>📘</span> HIVATALOS MARKETING &amp; SALES PLAYBOOK
      </div>
      <h1 class="cover-title">
        Ügyfélszerzési Kézikönyv &amp; Gyakorlati Útmutató
      </h1>
      <p class="cover-subtitle">
        Minden stratégia, szkript, folyamat és technológiai háttér, amire szükséged van a sikeres B2B ügyfélszerzéshez. Kötetlen munka, 100% Home Office, transzparens jutalékrendszer és Microsoft által támogatott termékkínálat.
      </p>

      <div class="cover-grid">
        <div class="cover-card">
          <div class="icon">🏡</div>
          <h4>100% Home Office &amp; Rugalmasság</h4>
          <p>Kötetlen munkaidő, földrajzi szabadság. A Backline IT-nál nincsenek felesleges meetingek vagy mikromenedzsment – a cél a minőségi kapcsolatok megnyitása.</p>
        </div>

        <div class="cover-card">
          <div class="icon">💰</div>
          <h4>15% Sikerdíj + Havi 15% Ismétlődő</h4>
          <p>Minden projektnél megkapod a 15%-ot. Havidíjas ügyfeleknél a 15% havonta, folyamatosan jár – akár évekkel később is, életre szóló ügyfél-hozzárendeléssel!</p>
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
          <h4>Microsoft for Startups Partnerség</h4>
          <p>Hivatalosan elismert startup tagság: fejlett Azure felhő és OpenAI modellek kedvező áron. Ez a legfőbb versenyelőnyünk a piacon!</p>
        </div>

        <div class="cover-card">
          <div class="icon">🎯</div>
          <h4>Tiszta Szerepkör: Meetingig Kísérés</h4>
          <p>A te feladatod a meeting lebeszélése. A műszaki felmérést, az árajánlatot és a lezárást a tapasztalt sales és technikai csapat viszi tovább.</p>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div class="author-info">
        <h5>Backline IT Vezetőség</h5>
        <p>Alapító &amp; Rendszerfejlesztő: Török Norbert | Web: backlineit.hu</p>
      </div>
      <div class="confidential-note">
        Belső Használatra • Szigorúan Bizalmas<br>
        Verzió: 2.0 (2026)
      </div>
    </div>
  </div>

  <!-- ==================== OLDAL 2: A CÉG, KÜLDETÉS & MICROSOFT ELŐNY ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">1. Fejezet: Cégidentitás &amp; Microsoft Előny</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">Kik Vagyunk &amp; Mit Képviselünk?</div>
        <h2 class="section-title">A Backline IT Küldetése &amp; A Piaci Áttörésünk</h2>
        <p class="section-desc">
          Nem hagyományos webfejlesztő ügynökség vagyunk, hanem agilis, modern technológiai startup. Célunk, hogy a magyar kkv-k és vállalkozások megszabaduljanak a lassú weboldalaktól és a felesleges kézi munkától.
        </p>
      </div>

      <div class="ms-highlight-box">
        <div class="ms-grid-icon" style="transform: scale(1.3); margin-left: 4px;">
          <div class="ms-sq ms-red"></div>
          <div class="ms-sq ms-green"></div>
          <div class="ms-sq ms-blue"></div>
          <div class="ms-sq ms-yellow"></div>
        </div>
        <div style="margin-left: 8px;">
          <h4 style="font-size: 12.5px; font-weight: 700; color: #0284c7; margin-bottom: 2px;">
            A DÖNTŐ ÉRV: MICROSOFT FOR STARTUPS ELISMERTSÉG
          </h4>
          <p style="font-size: 10.5px; color: #334155; line-height: 1.4;">
            A Backline IT a <strong>Microsoft hivatalos startup programjának tagja</strong>. Ez nem csak egy plecsni: hozzáférést biztosít számunkra a Microsoft Azure felhőinfrastruktúrájához és az OpenAI legmodernebb mesterséges intelligencia modelljeihez. Ez teszi lehetővé, hogy <strong>bármilyen felhőszolgáltatást rendkívül baráti, versenyképes áron</strong> tudjunk biztosítani ügyfeleinknek.
          </p>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #2563eb;">🚀</div>
            <div class="card-title">Gyorsaság &amp; Hatékonyság</div>
          </div>
          <p class="card-text">
            Nálunk nincs hetekig húzódó bürokrácia: a megkereséstől számított <strong>48 órán belül kiküldjük a precíz árajánlatot</strong>, és annak elfogadása után <strong>24 órán belül a szerződéstervezetet</strong>.
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #10b981;">🛡️</div>
            <div class="card-title">Kockázatmentes Együttműködés</div>
          </div>
          <p class="card-text">
            Minden egyedi fejlesztésünkre <strong>90 napos díjmentes hibajavítási garanciát</strong> vállalunk. Soha nem kérjük el előre a projekt 100%-át; mérföldköves, tisztességes elszámolással dolgozunk.
          </p>
        </div>
      </div>

      <h3 style="font-size: 12.5px; font-weight: 700; color: #0f172a; margin: 10px 0 6px 0;">Miért Olyan Könnyű Velünk Kapcsolatot Építeni?</h3>
      <div class="card" style="background: #ffffff; border: 1.5px solid #e2e8f0;">
        <ul class="check-list">
          <li><strong>Van ingyenes "ajtónyitónk":</strong> Minden érdeklődőnek fel tudsz ajánlani egy <strong>30 perces díjmentes szakmai konzultációt</strong>, ahol átvilágítjuk a jelenlegi webes és informatikai működésüket.</li>
          <li><strong>Élő demók és referenciák:</strong> Nem ígéreteket árulunk: a <code>backlineit.hu/referenciak</code> oldalon azonnal kattintható, működő rendszereket mutathatsz meg.</li>
          <li><strong>Valódi értékteremtés:</strong> Amikor egy cég meglátja, hogy az n8n automatizációval havi 50–100 óra felesleges munkát spórol meg, az árunk azonnal megtérülő befektetéssé válik.</li>
        </ul>
      </div>

      <div class="quote-box">
        "Nem az a cél, hogy ráerőltessünk valamit az ügyfélre. Az a cél, hogy megmutassuk neki: ma már nem kell milliókat kifizetni a lassú ügynökségeknek, és nem kell elavult sablonokkal beérni, ha a Microsoft technológiája elérhető számára baráti áron."
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>2. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 3: A JUTALÉKRENDSZER & ÉLETRE SZÓLÓ JUTALÉK ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">2. Fejezet: Díjazás &amp; CRM Transzparencia</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">A Te Jövedelmed</div>
        <h2 class="section-title">A 15%-os Jutalékmodell &amp; Az Életre Szóló Jutalékkövetés</h2>
        <p class="section-desc">
          Kezdő startupként nálunk nincs fix bér, de nincs semmilyen kereseti korlát sem. A Backline IT-nál a piacon elérhető legtisztességesebb és legkedvezőbb partneri modellt építettük fel számodra.
        </p>
      </div>

      <div class="grid-2">
        <div class="card blue-highlight">
          <div class="card-header">
            <div class="card-icon" style="color: #2563eb;">⚡</div>
            <div class="card-title">1. Pillér: 15% Egyszeri Sikerdíj</div>
          </div>
          <p class="card-text">
            Minden olyan egyedi megbízás díjából, amit te hoztál be (a 10.000 Ft-os bővítménytől a 2-3 millió Ft-os egyedi rendszerekig), <strong>15% tiszta jutalékot kapsz</strong> az ügyfél fizetését követő 48 órán belül.
          </p>
        </div>

        <div class="card highlight">
          <div class="card-header">
            <div class="card-icon" style="color: #10b981;">💎</div>
            <div class="card-title">2. Pillér: 15% Havi Ismétlődő Jutalék</div>
          </div>
          <p class="card-text">
            Ha az ügyfél havidíjas megbízást köt (karbantartás, automatizáció felügyelet, felhő SLA), a <strong>15%-os részesedést minden egyes hónapban megkapod</strong>, amíg az ügyfél velünk van!
          </p>
        </div>
      </div>

      <div class="callout-banner">
        <div>
          <h4>🔒 ÉLETRE SZÓLÓ JUTALÉKVÉDELEM (LIFELONG ATTRIBUTION)</h4>
          <p>Ha te hoztad a kapcsolatot, és bekerült a Backline IT CRM rendszerébe, az ügyfél örökre hozzád van rendelve! Ha most csak érdeklődik, de <strong>fél év vagy akár 2 év múlva köt szerződést</strong>, a 15%-os jutalékodat AKKOR IS garantáltan megkapod!</p>
        </div>
        <div class="callout-val">
          100%
          <small>CRM VÉDELEM</small>
        </div>
      </div>

      <h3 style="font-size: 12.5px; font-weight: 700; color: #0f172a; margin-top: 10px;">Valós Kereseti Szimuláció a Gyakorlatban</h3>

      <table class="custom-table">
        <thead>
          <tr>
            <th>Értékesített Megoldás</th>
            <th>Ügyfélszámla (Nettó)</th>
            <th>Jutalék Forma</th>
            <th>A Te Kereseted (15%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Digitális termék / Script (Webshop)</td>
            <td>45 000 Ft</td>
            <td>Egyszeri megbízás</td>
            <td><span class="badge-blue">6 750 Ft</span></td>
          </tr>
          <tr>
            <td>Egyedi Next.js Céges Honlap</td>
            <td>850 000 Ft</td>
            <td>Egyszeri megbízás</td>
            <td><span class="badge-blue">127 500 Ft</span></td>
          </tr>
          <tr>
            <td>Komplex Rendszerfejlesztés + Integrációk</td>
            <td>2 500 000 Ft</td>
            <td>Egyszeri megbízás</td>
            <td><span class="badge-blue">375 000 Ft</span></td>
          </tr>
          <tr>
            <td>Havi Rendszergazda &amp; Karbantartási csomag</td>
            <td>150 000 Ft / hó</td>
            <td>Havi ismétlődő</td>
            <td><span class="badge-green">22 500 Ft / hó</span></td>
          </tr>
          <tr>
            <td>Prémium Felhő &amp; n8n SLA Retainer</td>
            <td>300 000 Ft / hó</td>
            <td>Havi ismétlődő</td>
            <td><span class="badge-green">45 000 Ft / hó</span></td>
          </tr>
          <tr style="background: #f1f5f9; font-weight: 700;">
            <td colspan="3"><strong>Kumulatív hatás 10 aktív havidíjas ügyfél után:</strong></td>
            <td><span style="color: #059669; font-size: 11.5px;">~300 000 Ft / hó BIZTOS PASSZÍV + egyszeri díjak!</span></td>
          </tr>
        </tbody>
      </table>

      <div class="card ms-highlight" style="padding: 10px 12px; margin-top: 4px;">
        <p style="font-size: 10.5px; color: #0369a1; line-height: 1.4;">
          <strong>Hogyan követed nyomon?</strong> Hozzáférést kapsz a <strong>Backline IT CRM rendszeréhez</strong>. Látod a felvitt kontaktokat, a folyamatban lévő ajánlatokat, a megkötött szerződéseket és a beérkező számlák alapján jóváírt jutalékaidat. Teljes transzparencia, nulla kétely.
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>3. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 4: CÉLCSOPORT & FÁJDALOMPONT ELEMZÉS (ICP) ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">3. Fejezet: Piaci Célzás (ICP)</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">Kinek Értékesítünk?</div>
        <h2 class="section-title">Ideális Ügyfélprofil &amp; A 2 Legnagyobb Piaci Fájdalom</h2>
        <p class="section-desc">
          Szolgáltatásaink minden olyan vállalkozásnak szólnak, amely digitálisan jelen van. A kommunikációdban erre a két kulcsproblémára kell rátapintanod, mert ezek nyitják ki az ajtókat.
        </p>
      </div>

      <div class="grid-2">
        <div class="card" style="border-left: 4px solid #ef4444;">
          <h4 style="font-size: 12px; font-weight: 700; color: #b91c1c; margin-bottom: 4px;">
            1. FÁJDALOM: LASSÚ, ELAVULT HONLAPOK
          </h4>
          <p style="font-size: 10.5px; color: #475569; line-height: 1.4;">
            A vállalkozások 70%-a elavult WordPress oldalt használ. Lassan tölt be mobilon, feltörik a bővítményeket, a látogatók 40%-a elhagyja az oldalt még betöltés előtt. A Google bünteti őket a keresőben, és vevőket veszítenek.
          </p>
        </div>

        <div class="card" style="border-left: 4px solid #f59e0b;">
          <h4 style="font-size: 12px; font-weight: 700; color: #b45309; margin-bottom: 4px;">
            2. FÁJDALOM: HORROR ÁRÚ, LASSÚ ÜGYNÖKSÉGEK
          </h4>
          <p style="font-size: 10.5px; color: #475569; line-height: 1.4;">
            A klasszikus ügynökségek 3-5 millió forintot kérnek egy egyszerű fejlesztésért, hetekig nem válaszolnak az emailekre, és minden apró módosításért súlyos számlákat küldenek. A döntéshozók csalódtak bennük.
          </p>
        </div>
      </div>

      <h3 style="font-size: 12.5px; font-weight: 700; color: #0f172a; margin: 10px 0 6px 0;">A 3 Fő Vásárlói Karakter (Buyer Persona)</h3>

      <div class="grid-3">
        <div class="card" style="padding: 10px;">
          <span class="badge-blue" style="margin-bottom: 4px;">PERSONA 1</span>
          <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin: 3px 0;">Szolgáltató Kkv Vezető</h4>
          <p style="font-size: 9.5px; color: #64748b; margin-bottom: 6px;">(Ügyvédi irodák, könyvelők, magánklinikák, tanácsadók)</p>
          <p style="font-size: 10px; color: #334155; line-height: 1.35;"><strong>Fő vágya:</strong> Megbízható, modern webes megjelenés és automata lead-kezelés, hogy a titkárnőnek ne kelljen manuálisan gépelnie.</p>
        </div>

        <div class="card" style="padding: 10px;">
          <span class="badge-green" style="margin-bottom: 4px;">PERSONA 2</span>
          <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin: 3px 0;">E-kereskedő / Webshop</h4>
          <p style="font-size: 9.5px; color: #64748b; margin-bottom: 6px;">(Shoprenter, WooCommerce, egyedi boltok)</p>
          <p style="font-size: 10px; color: #334155; line-height: 1.35;"><strong>Fő vágya:</strong> Gyorsabb betöltés mobilon, automata számlázás, készlet-szinkron és kevesebb kosárelhagyás.</p>
        </div>

        <div class="card" style="padding: 10px;">
          <span class="badge-amber" style="margin-bottom: 4px;">PERSONA 3</span>
          <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin: 3px 0;">Gyártó &amp; Kereskedelmi Kkv</h4>
          <p style="font-size: 9.5px; color: #64748b; margin-bottom: 6px;">(B2B nagykereskedők, kivitelezők)</p>
          <p style="font-size: 10px; color: #334155; line-height: 1.35;"><strong>Fő vágya:</strong> Felhő infrastruktúra, üzleti dashboardok, ERP/CRM integráció és stabil 0-24 rendszerfelügyelet.</p>
        </div>
      </div>

      <div class="card" style="background: #ffffff; border: 1.5px solid #e2e8f0; margin-top: 6px; padding: 10px 14px;">
        <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">🎯 A Nyerő Pozicionálásunk:</h4>
        <p style="font-size: 10.5px; color: #334155; line-height: 1.45;">
          <em>„Mi nem egy bürokratikus multi vagyunk, aki lehúzza a kkv-kat, de nem is egy megbízhatatlan szabadúszó: a Microsoft által támogatott háttérrel építünk ultragyors, modern digitális rendszereket korrekt áron, 90 napos garanciával.”</em>
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>4. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 5: SZOLGÁLTATÁSKATALÓGUS 1 ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">4. Fejezet: Termékkínálat (1. Rész)</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">Mit Értékesítünk?</div>
        <h2 class="section-title">Webfejlesztés, Felhő Infrastruktúra &amp; Karbantartás</h2>
        <p class="section-desc">
          Minden szolgáltatásunk részletesen elérhető a <code>backlineit.hu/szolgaltatasok</code> oldalon. Íme az alapvető fejlesztési és felhő pillérek, amelyeket a leggyakrabban keresnek a vállalkozások.
        </p>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #2563eb;">⚡</div>
            <div class="card-title">Next.js Webfejlesztés</div>
          </div>
          <p class="card-text">
            <strong>Mi ez?</strong> Prémium minőségű, villámgyors egyedi weboldalak és portálok a legmodernebb Next.js technológiával.<br>
            <strong>Előnyök:</strong> Nem törhető fel mint egy régi WordPress, azonnal betölt mobilon, kiváló Google SEO helyezések.<br>
            <strong>Ársáv:</strong> 350 000 Ft – 1 500 000 Ft+
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #0284c7;">☁️</div>
            <div class="card-title">Felhő Migráció &amp; Optimalizálás</div>
          </div>
          <p class="card-text">
            <strong>Mi ez?</strong> Céges adatok és szerverek költöztetése modern felhőbe (Microsoft Azure, Cloudflare).<br>
            <strong>Előnyök:</strong> Költségcsökkentés, megszűnnek a hardverhibák, bárhonnan biztonságosan elérhető céges környezet.<br>
            <strong>Ársáv:</strong> 250 000 Ft – 1 200 000 Ft
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #10b981;">🛡️</div>
            <div class="card-title">Havidíjas Rendszergazda &amp; SLA</div>
          </div>
          <p class="card-text">
            <strong>Mi ez?</strong> 0-24 felügyelet, hibaelhárítás, frissítések, biztonsági mentések és helpdesk.<br>
            <strong>Előnyök:</strong> A cégvezető nyugodtan alszik, nem áll le a rendszer. Ez hozza a te havi passzív 15%-odat!<br>
            <strong>Ársáv:</strong> 80 000 Ft – 350 000 Ft / hó
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #8b5cf6;">🔍</div>
            <div class="card-title">KKV IT &amp; Biztonsági Audit</div>
          </div>
          <p class="card-text">
            <strong>Mi ez?</strong> 100+ pontos átvilágítás a weboldal sebességéről, adatbiztonságról és a felesleges IT költségekről.<br>
            <strong>Előnyök:</strong> Feltárja a sebezhetőségeket és azonnali megtakarítási pontokat mutat be a cégvezetőnek.<br>
            <strong>Ársáv:</strong> 120 000 Ft – 300 000 Ft (vagy konzultációba építve)
          </p>
        </div>
      </div>

      <div class="card blue-highlight" style="padding: 10px 14px; margin-top: 4px;">
        <h4 style="font-size: 11.5px; font-weight: 700; color: #1e40af; margin-bottom: 2px;">
          💡 Sales Tipp: A "Weboldal Sebesség" Ajtónyitó
        </h4>
        <p style="font-size: 10px; color: #1e3a8a; line-height: 1.4;">
          Amikor egy cégvezetővel beszélsz, nyisd meg a <code>pagespeed.web.dev</code> oldalt, és dobd be a jelenlegi honlapjukat. Ha 50 pont alatt van (piros), mondd ezt: <em>„Nézze, a látogatóinak a fele elmegy, mert 4 másodpercig tart a betöltés. A mi Next.js rendszereink 95+ pontot érnek el és azonnal betöltenek.”</em> Ez azonnal lefoglalja a meetinget!
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>5. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 6: SZOLGÁLTATÁSKATALÓGUS 2 ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">4. Fejezet: Termékkínálat (2. Rész)</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">Automatizáció &amp; AI</div>
        <h2 class="section-title">n8n Munkafolyamat-automatizálás &amp; Mesterséges Intelligencia</h2>
        <p class="section-desc">
          Ez a legdinamikusabban növekvő üzletágunk. A cégvezetők legfőbb problémája ma a munkaerőhiány és a magas bérköltség – az automatizációval szoftverrobotokat építünk nekik.
        </p>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #ec4899;">🤖</div>
            <div class="card-title">n8n Üzleti Automatizáció</div>
          </div>
          <p class="card-text">
            <strong>Mi ez?</strong> Összekötjük a különböző rendszereket (Weboldal, Számlázz.hu, CRM, Slack, Google Drive, Futárcégek).<br>
            <strong>Példa:</strong> Új megrendelés $\rightarrow$ Automata számla kiállítás $\rightarrow$ Futár megrendelés $\rightarrow$ Köszönő email.<br>
            <strong>Ársáv:</strong> 250 000 Ft – 1 800 000 Ft
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #6366f1;">🧠</div>
            <div class="card-title">AI Asszisztensek &amp; Ügyfélszolgálat</div>
          </div>
          <p class="card-text">
            <strong>Mi ez?</strong> Cégre szabott mesterséges intelligencia robotok (OpenAI alapon), amik 0-24 válaszolnak a weboldalon a vevők kérdéseire.<br>
            <strong>Példa:</strong> Ismeri a teljes termékkínálatot, ajánlatot ad és lefoglalja az időpontot a naptárba.<br>
            <strong>Ársáv:</strong> 200 000 Ft – 900 000 Ft
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #f59e0b;">📊</div>
            <div class="card-title">Üzleti Dashboardok &amp; Riportok</div>
          </div>
          <p class="card-text">
            <strong>Mi ez?</strong> Valós idejű vezetői műszerfal, ahol a tulajdonos egyetlen képernyőn látja a napi árbevételt, készleteket és leadeket.<br>
            <strong>Előnyök:</strong> Nincs több manuális Excel táblázat és félrekattintott képlet.<br>
            <strong>Ársáv:</strong> 180 000 Ft – 650 000 Ft
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #10b981;">📦</div>
            <div class="card-title">Kész Digitális Termékek &amp; Pluginok</div>
          </div>
          <p class="card-text">
            <strong>Mi ez?</strong> Dobozos szoftverek (WooCommerce Számlázz.hu integráció, n8n lead-kutató robotok, SaaS sablonok).<br>
            <strong>Előnyök:</strong> Azonnal megvehető a webshopunkban, kiváló alacsony belépő termék.<br>
            <strong>Ársáv:</strong> 10 000 Ft – 120 000 Ft
          </p>
        </div>
      </div>

      <div class="card highlight" style="padding: 10px 14px; margin-top: 4px;">
        <h4 style="font-size: 11.5px; font-weight: 700; color: #15803d; margin-bottom: 2px;">
          💰 A Havidíjas Automatizáció Felügyelet Szerepe
        </h4>
        <p style="font-size: 10px; color: #166534; line-height: 1.4;">
          Miután megépítettünk egy automatizációt, a cégek havi díjat fizetnek a szerverek felügyeletéért és a hibamentes működésért (jellemzően havi 60 000 – 150 000 Ft). <strong>Ebből minden hónapban megkapod a 15%-ot!</strong> Ez az a pillér, ami néhány hónap alatt önműködő passzív jövedelmet biztosít számodra.
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>6. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 7: REFERENCIÁK, DEMÓK & BELÉPŐ AJÁNLAT ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">5. Fejezet: Referenciák &amp; Ajtónyitó</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">A Bizalom Építése</div>
        <h2 class="section-title">Referenciák, Interaktív Demók &amp; Az Ingyenes Konzultáció</h2>
        <p class="section-desc">
          A B2B értékesítés alapja a bizonyíték. A Backline IT-nál kész, működő rendszereket és díjmentes értéket adunk a kezedbe, így nem "eladnod" kell, hanem segítséget nyújtanod.
        </p>
      </div>

      <div class="callout-banner" style="background: linear-gradient(135deg, #0284c7, #0f172a);">
        <div>
          <h4>🎁 AZ ELSŐDLEGES AJTÓNYITÓ: 30 PERCES INGYENES KONZULTÁCIÓ</h4>
          <p>Minden kapcsolatfelvétel célja kizárólag egyetlen dolog: felajánlani a 30 perces díjmentes szakmai konzultációt! Nem kell árakat vitatnod és nem kell szerződést kötnöd – csak juttasd el a döntéshozót a konzultációig.</p>
        </div>
        <div class="callout-val" style="color: #38bdf8;">
          30 PERC
          <small>DÍJMENTES ÉRTÉK</small>
        </div>
      </div>

      <h3 style="font-size: 12.5px; font-weight: 700; color: #0f172a; margin: 10px 0 6px 0;">Referenciák &amp; Demók (<code>backlineit.hu/referenciak</code>)</h3>

      <div class="grid-2">
        <div class="card" style="padding: 10px 12px;">
          <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">🖥️ Élő Interaktív Demók</h4>
          <p style="font-size: 10px; color: #475569; line-height: 1.4;">
            A weboldalunkon bárki kipróbálhatja a működő n8n webhook folyamatokat, az AI chatbotot és a modern ügyfélportált. Nincs jobb meggyőző erő annál, mint amikor a saját szemével látja működés közben a technológiát.
          </p>
        </div>

        <div class="card" style="padding: 10px 12px;">
          <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">📁 Esettanulmányok &amp; Metrikák</h4>
          <p style="font-size: 10px; color: #475569; line-height: 1.4;">
            Konkrét számok: <em>„3,8 másodpercről 0,6 másodpercre csökkentett betöltési idő”</em>, <em>„Heti 18 óra megspórolt számlázási munka”</em>, <em>„99,99% felhő rendelkezésre állás”</em>. Ezeket bátran idézheted a leveleidben.
          </p>
        </div>
      </div>

      <h3 style="font-size: 12.5px; font-weight: 700; color: #0f172a; margin: 10px 0 6px 0;">Hogyan Mutasd Be a Konzultációt a Megkeresésekben?</h3>
      <div class="script-box">
        <div class="script-title">Ajánlott Kommunikációs Panel:</div>
        „Tisztelt [Név]! Nem szeretnék feleslegesen rabolni az idejét. Tudjuk, hogy mennyi bosszúságot okoznak a lassú honlapok és a túlárazott ügynökségek. Szívesen felajánlunk egy 30 perces díjmentes online konzultációt, ahol átnézzük a jelenlegi rendszerüket, megmutatjuk a szűk keresztmetszeteket, és konkrét javaslatot adunk – minden kötelezettség nélkül. Mikor lenne alkalmas egy rövid egyeztetés a héten?”
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>7. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 8: A SALES FOLYAMAT & MUNKAMEGOSZTÁS ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">6. Fejezet: Munkafolyamat (Pipeline)</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">A Munkamegosztás</div>
        <h2 class="section-title">A Sales Folyamat Lépésről Lépésre: Ki Mit Csinál?</h2>
        <p class="section-desc">
          A te feladatod kristálytiszta: a kapcsolat felvétele és az online meeting megszervezése. Onnantól, hogy a naptárban van az időpont, a sales és technikai csapat veszi át a stafétát.
        </p>
      </div>

      <div class="timeline">
        <div class="timeline-step active">
          <div class="step-num">1. LÉPÉS (TE)</div>
          <div class="step-title">Megkeresés &amp; Kvalifikáció</div>
          <div class="step-desc">Kapcsolatfelvétel, fájdalompont feltárása, 30 perces konzultáció felajánlása.</div>
        </div>

        <div class="timeline-step active">
          <div class="step-num">2. LÉPÉS (TE)</div>
          <div class="step-title">Meeting Lefoglalása</div>
          <div class="step-desc">Időpont rögzítése a naptárba, kontakt és igények felvitele a Backline IT CRM-be.</div>
        </div>

        <div class="timeline-step">
          <div class="step-num">3. LÉPÉS (CSAPAT)</div>
          <div class="step-title">Konzultáció &amp; Ajánlat</div>
          <div class="step-desc">A sales és szakmai csapat levezeti a meetinget. 48 órán belül kiküldjük a pontos árajánlatot.</div>
        </div>

        <div class="timeline-step">
          <div class="step-num">4. LÉPÉS (CSAPAT)</div>
          <div class="step-title">Szerződés &amp; Kifizetés</div>
          <div class="step-desc">24 órán belül szerződéstervezet. Ügyfélbefizetés után 48 órán belül átutaljuk a 15% jutalékodat!</div>
        </div>
      </div>

      <h3 style="font-size: 12.5px; font-weight: 700; color: #0f172a; margin: 12px 0 6px 0;">A Backline IT Szigorú Értékesítési Szabályzata</h3>

      <div class="grid-2">
        <div class="card" style="padding: 10px 12px;">
          <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">⏱️ 48 Órás Árajánlat Adási Garancia</h4>
          <p style="font-size: 10px; color: #475569; line-height: 1.4;">
            Miután megtörtént a konzultáció, az ügyfél legkésőbb 48 órán belül kézhez kapja a részletes árajánlatot. Nem altatjuk a leadeket, a gyorsaságunk a legnagyobb fegyverünk.
          </p>
        </div>

        <div class="card" style="padding: 10px 12px;">
          <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">📄 24 Órás Szerződéstervezet</h4>
          <p style="font-size: 10px; color: #475569; line-height: 1.4;">
            Az árajánlat jóváhagyása után 24 órán belül küldjük a jogilag rendezett, precíz szerződéstervezetet (SLA-val és garanciákkal).
          </p>
        </div>

        <div class="card" style="padding: 10px 12px;">
          <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">🛡️ 90 Napos Hibajavítási Garancia</h4>
          <p style="font-size: 10px; color: #475569; line-height: 1.4;">
            Az átadás után 90 napig minden esetleges technikai hibát ingyen és azonnal javítunk. Ezzel teljesen levesszük a kockázatot az ügyfél válláról.
          </p>
        </div>

        <div class="card" style="padding: 10px 12px;">
          <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">🤝 Fair Mérföldköves Fizetés</h4>
          <p style="font-size: 10px; color: #475569; line-height: 1.4;">
            Soha nem kérjük el előre a projekt 100%-át. A feladat jellegétől függően 30-50% előleg, a többi az átadáskor és a tesztelés után fizetendő.
          </p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>8. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 9: CSATORNÁK 1: LINKEDIN & HIDEG EMAIL ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">7. Fejezet: Csatornák (LinkedIn &amp; E-mail)</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">Aktivitás &amp; Sablonok</div>
        <h2 class="section-title">B2B Ügyfélszerzés: LinkedIn Stratégia &amp; Hideg E-mail</h2>
        <p class="section-desc">
          A B2B döntéshozók elérhetők, ha az üzeneted nem sablonos spam, hanem közvetlen, releváns és azonnali üzleti értéket mutat fel.
        </p>
      </div>

      <h3 style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">1. Csatorna: LinkedIn B2B Outreach (A legmagasabb konverzió)</h3>
      <p style="font-size: 10.5px; color: #475569; margin-bottom: 6px;">
        Keresd az ügyvezetőket, cégtulajdonosokat és marketingvezetőket. Küldj személyre szabott kapcsolatfelvételt az alábbi minták alapján:
      </p>

      <div class="script-box">
        <div class="script-title">LinkedIn Kapcsolatfelvételi Üzenet (300 karakter):</div>
        „Kedves [Keresztnév]! Figyelemmel kísérem a [Cégnév] fejlődését. A Backline IT-nál (Microsoft által elismert startup) kkv-knak segítünk lecserélni a lassú honlapokat és automatizálni a monoton adminisztrációt. Szívesen megosztanék egy rövid esettanulmányt, ha nyitott rá. Üdv, [A te neved]”
      </div>

      <div class="script-box">
        <div class="script-title">LinkedIn 2. Lépés (Válasz / Elfogadás után):</div>
        „Köszönöm a kapcsolódást, [Keresztnév]! Sok cégvezetővel beszélve azt látjuk, hogy a túlárazott ügynökségek és a lassú betöltés rengeteg vevőt visz el. Mi a Microsoft technológiájával, garanciával dolgozunk. Ha gondolja, egy 30 perces díjmentes videóhívásban átnézzük a jelenlegi webes és automatizációs lehetőségeiket. Mikor lenne jó egy rövid egyeztetés?”
      </div>

      <h3 style="font-size: 12px; font-weight: 700; color: #0f172a; margin: 10px 0 4px 0;">2. Csatorna: Célzott Hideg E-mail Szekvencia</h3>

      <div class="script-box">
        <div class="script-title">E-mail Tárgymező: [Cégnév] weboldal &amp; technológiai hatékonyság</div>
        „Kedves [Név]!<br><br>
        Látva a [Cégnév] piaci jelenlétét, közvetlenül keresem Önt. A Backline IT alapító csapataként azt tapasztaljuk, hogy a kkv-k többsége havonta több százezer forintot veszít lassú weboldalak és felesleges kézi számlázás/adminisztráció miatt.<br><br>
        A Microsoft startup programjának elismert partnereként olyan modern Next.js weboldalakat és n8n munkafolyamat-robotokat építünk, amelyek heti 15-20 óra munkát spórolnak meg, és 90 napos hibajavítási garanciát adunk minden fejlesztésre.<br><br>
        Szívesen felajánlunk Önnek egy <strong>30 perces díjmentes online konzultációt</strong>, ahol átvilágítjuk a jelenlegi rendszereiket, és konkrét megtakarítási pontokat mutatunk.<br><br>
        Alkalmas lenne Önnek egy 15 perces rövid hívás szerdán vagy csütörtök délelőtt?<br><br>
        Üdvözlettel,<br>
        [A te neved] | Backline IT Business Development”
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>9. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 10: CSATORNÁK 2: FACEBOOK & GOOGLE MAPS ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">7. Fejezet: Csatornák (Facebook &amp; Maps)</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">Gyors Eredmények</div>
        <h2 class="section-title">Tematikus Facebook Csoportok &amp; A Google Maps Módszer</h2>
        <p class="section-desc">
          Két olyan ügyfélszerzési technika, amellyel azonnal, hideghívások nélkül, közvetlenül a legégetőbb problémákkal rendelkező cégeket találod meg.
        </p>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #1877f2;">👥</div>
            <div class="card-title">Tematikus Facebook Csoportok</div>
          </div>
          <p class="card-text">
            <strong>Hol keresd?</strong> Cégvezetők, E-kereskedelem, Webshop tulajdonosok, Kkv marketing klubok, WordPress segítség csoportok.<br>
            <strong>A stratégia:</strong> Ne spamelj reklámot! Keresd a posztokat, ahol emberek panaszkodnak: <em>„Lassú a webshopom”</em>, <em>„Nem működik a számlázó integráció”</em>, <em>„Tudtok jó fejlesztőt?”</em><br>
            <strong>Lépés:</strong> Válaszolj szakmailag, mutass be egy konkrét megoldást, és hívd meg őket privát üzenetben a 30 perces konzultációra.
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #ea4335;">📍</div>
            <div class="card-title">A „Google Maps Módszer”</div>
          </div>
          <p class="card-text">
            <strong>Mi ez?</strong> A legkönnyebb módja a fizetőképes, de elavult IT-val rendelkező cégek megtalálásának.<br>
            <strong>Hogyan működik?</strong><br>
            1. Nyisd meg a Google Térképet egy városban (pl. Győr, Debrecen, Budapest).<br>
            2. Keress rá iparágakra: <em>„autószerviz”, „fogászat”, „ügyvédi iroda”, „bútorgyártó”, „épületgépészet”</em>.<br>
            3. Nyisd meg a weboldalukat. Ha 2012-es kinézetű vagy lassan tölt be mobilon, máris megvan a tökéletes lead!
          </p>
        </div>
      </div>

      <h3 style="font-size: 12px; font-weight: 700; color: #0f172a; margin: 10px 0 4px 0;">Google Maps Megkeresési Sablon (Azonnali reakcióra tervezve)</h3>

      <div class="script-box">
        <div class="script-title">Google Maps Üzenetsablon (Emailben vagy Kapcsolati Űrlapon):</div>
        „Tisztelt Vezetőség! A Google Mapsen találtam rá a vállalkozásukra, gratulálok a kiváló értékeléseikhez!<br><br>
        Megnéztem a weboldalukat mobilon, és feltűnt, hogy sajnos több mint 4-5 másodpercbe telik a betöltése, ami miatt a potenciális ügyfelek jelentős része még a megtekintés előtt visszafordul a Google keresőbe.<br><br>
        A Backline IT-nál (Microsoft által elismert technológiai partnerként) segítünk kkv-knak korszerű, villámgyors webes rendszereket építeni. Szívesen felajánlunk Önöknek egy <strong>30 perces díjmentes szakmai konzultációt</strong>, ahol megmutatjuk a sebesség és az automata ügyfélfogadás fejlesztési lehetőségeit.<br><br>
        Mikor lenne alkalmas Önöknek egy rövid 15 perces telefonos vagy online egyeztetés a héten?<br><br>
        Üdvözlettel: [A te neved] | Backline IT”
      </div>

      <div class="card blue-highlight" style="padding: 9px 12px; margin-top: 4px;">
        <p style="font-size: 10px; color: #1e3a8a; line-height: 1.35;">
          <strong>Napi feladat a 150-es KPI-hoz:</strong> Ha mindennap mindössze 5 céget keresel meg a Google Maps módszerrel és 3 kapcsolatot kezdeményezel LinkedInen, a havi 150-es elvárást kényelmesen túlteljesíted!
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>10. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 11: KIFOGÁSKEZELÉSI MESTERKURZUS ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">8. Fejezet: Kifogáskezelés</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">Magabiztos Tárgyalás</div>
        <h2 class="section-title">Kifogáskezelési Mesterkurzus: A Gyilkos Válaszok</h2>
        <p class="section-desc">
          A B2B értékesítésben a kifogás nem elutasítás, hanem a döntéshozó védekező reakciója. Ha felkészült vagy, minden kifogást azonnal a mi előnyünkre tudsz fordítani.
        </p>
      </div>

      <div class="card" style="margin-bottom: 8px; padding: 10px 12px; border-left: 4px solid #ef4444;">
        <h4 style="font-size: 11.5px; font-weight: 700; color: #b91c1c; margin-bottom: 3px;">
          1. KIFOGÁS: „A sarki fejlesztőm / ismerősöm féláron megcsinálja WordPressben.”
        </h4>
        <p style="font-size: 10.5px; color: #334155; line-height: 1.4;">
          <strong>A nyerő válasz:</strong> <em>„Érthető, hogy fontos az ár. De hadd kérdezzem meg: <strong>a sarki fejlesztője elismert a Microsoft által?</strong> Vállal 90 napos hivatalos hibajavítási garanciát és SLA-t szerződésben? Mi a legmodernebb Next.js rendszereket adjuk át, amik nem törhetők fel, és azonnal betöltenek. A WordPress olcsó az elején, de a folyamatos karbantartás és a kieső vevők miatt hosszú távon háromszor annyiba kerül.”</em>
        </p>
      </div>

      <div class="card" style="margin-bottom: 8px; padding: 10px 12px; border-left: 4px solid #f59e0b;">
        <h4 style="font-size: 11.5px; font-weight: 700; color: #b45309; margin-bottom: 3px;">
          2. KIFOGÁS: „Majd visszatérünk rá később / Most nincs erre időnk és kapacitásunk.”
        </h4>
        <p style="font-size: 10.5px; color: #334155; line-height: 1.4;">
          <strong>A nyerő válasz:</strong> <em>„Pontosan azért érdemes most beszélnünk 30 percet, mert nincs idejük! Az n8n automatizációink lényege, hogy heti 15-20 óra manuális adminisztrációt vesznek le a vállukról. Egyetlen rövid konzultáció nem kerül semmibe, de ha most megmutatjuk, hol veszítik a legtöbb időt, a következő negyedévet már felszabadult kapacitással indíthatják. Péntek délelőtt megfelelne egy 20 perces hívásra?”</em>
        </p>
      </div>

      <div class="card" style="margin-bottom: 8px; padding: 10px 12px; border-left: 4px solid #3b82f6;">
        <h4 style="font-size: 11.5px; font-weight: 700; color: #1d4ed8; margin-bottom: 3px;">
          3. KIFOGÁS: „Bocsi, végül mást választottunk / nem veletek megyünk tovább.”
        </h4>
        <p style="font-size: 10.5px; color: #334155; line-height: 1.4;">
          <strong>A nyerő válasz:</strong> <em>„Teljesen megértem, és sok sikert kívánok a projekthez! Egyetlen dologra hadd hívjam fel a figyelmét: ügyfeleink 30%-a úgy érkezik hozzánk, hogy a korábbi fejlesztőjük félbehagyta a munkát vagy nem tartotta a határidőt. Ha bármilyen elakadásuk adódna, tartsuk meg a kapcsolatot LinkedInen! Ha 1-2 hónap múlva szükségük lenne gyors technikai mentésre vagy felülvizsgálatra, a Backline IT csapata 48 órán belül be tud lépni segíteni.”</em><br>
          <span style="font-size: 9.5px; color: #64748b;">(Ezzel a válasszal a "bukott" ajánlatok 20%-a 2-3 hónap múlva hozzánk tér vissza!)</span>
        </p>
      </div>

      <div class="card" style="padding: 10px 12px; border-left: 4px solid #10b981;">
        <h4 style="font-size: 11.5px; font-weight: 700; color: #047857; margin-bottom: 3px;">
          4. KIFOGÁS: „Félünk attól, hogy előre kifizetjük a pénzt, aztán nem működik.”
        </h4>
        <p style="font-size: 10.5px; color: #334155; line-height: 1.4;">
          <strong>A nyerő válasz:</strong> <em>„Ettől egyáltalán nem kell tartaniuk. A Backline IT-nál soha nem várjuk el, hogy a megbízó a projekt 100%-át előre kifizesse. Mérföldkövek alapján, a kész állapotok tesztelése után fizetnek, és minden munkánkra 90 napos díjmentes garanciát adunk szerződésbe foglalva.”</em>
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>11. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 12: ESZKÖZTÁR, CRM & MUNKARITMUS ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">9. Fejezet: Munkakörnyezet &amp; CRM</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">A Technikai Háttered</div>
        <h2 class="section-title">Eszköztár, CRM Nyilvántartás &amp; Napi Ritmus Home Office-ban</h2>
        <p class="section-desc">
          Minden hivatalos hozzáférést biztosítunk számodra, hogy a legelső naptól kezdve profi, hiteles üzleti arculattal léphess piacra.
        </p>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #2563eb;">✉️</div>
            <div class="card-title">Hivatalos Céges E-mail Cím</div>
          </div>
          <p class="card-text">
            Saját <code>@backlineit.hu</code> végződésű professzionális e-mail fiókot kapsz, modern levelezőrendszerrel és beállított céges aláírással.
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #0284c7;">🔑</div>
            <div class="card-title">BacklineIT.hu Admin Jogosultság</div>
          </div>
          <p class="card-text">
            Hozzáférést biztosítunk a belső adminisztrációs felülethez és az ügyfélszerző demó fiókokhoz, hogy élőben tudd tesztelni és mutatni a funkciókat.
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #10b981;">📊</div>
            <div class="card-title">Backline IT CRM Rendszer</div>
          </div>
          <p class="card-text">
            Minden leadet itt rögzítesz. A rendszer azonnal hozzád rendeli a kontaktot, így a jutalékod 100%-ban védett, még évek múlva is!
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-icon" style="color: #8b5cf6;">📁</div>
            <div class="card-title">Értékesítési Mappák &amp; Pitch Deck</div>
          </div>
          <p class="card-text">
            Kész prezentációk, letölthető esettanulmányok, PDF anyagok, amiket egyetlen kattintással elküldhetsz a döntéshozóknak.
          </p>
        </div>
      </div>

      <h3 style="font-size: 12.5px; font-weight: 700; color: #0f172a; margin: 10px 0 6px 0;">Javasolt Napi Munkaritmus (Napi 2-3 óra koncentrált munka)</h3>

      <div class="card" style="background: #ffffff; border: 1.5px solid #e2e8f0; padding: 10px 14px;">
        <ul class="check-list">
          <li><strong>09:00 – 09:30:</strong> Előző napi megkeresések ellenőrzése, válaszadás az emailekre és LinkedIn üzenetekre.</li>
          <li><strong>09:30 – 10:30 (Új kapcsolatok):</strong> 6-8 célzott megkeresés elküldése (LinkedIn B2B profilok vagy Google Maps helyi vállalkozások).</li>
          <li><strong>10:30 – 11:00 (Follow-up):</strong> Azoknak a leadeknek az utánkövetése, akik korábban megnyitották az emailt vagy válaszoltak, időpontfoglalás a naptárba.</li>
          <li><strong>Délután:</strong> Új kontaktok rögzítése a CRM-be, egyeztetés Török Norberttel a lefoglalt meetingekről.</li>
        </ul>
      </div>

      <div class="card highlight" style="padding: 9px 12px; margin-top: 6px;">
        <p style="font-size: 10.5px; color: #166534; line-height: 1.4;">
          <strong>A szabadságod:</strong> Nincs kötelező blokkolás vagy munkaidő-nyilvántartás. Dolgozhatsz reggel, este vagy hétvégén – te osztod be az idődet a saját életritmusod szerint.
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>12. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 13: 30-60-90 NAPOS AKCIÓTERV & KPI ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">10. Fejezet: Akcióterv &amp; KPI-ok</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">A Siker Útja</div>
        <h2 class="section-title">30–60–90 Napos Akcióterv &amp; Hivatalos KPI Elvárások</h2>
        <p class="section-desc">
          Konkrét, mérhető számokkal dolgozunk. Íme az elvárások és a lépések, amelyek garantálják, hogy már az első hónapban megvalósuljanak az első sikeres meetingjeid.
        </p>
      </div>

      <div class="callout-banner" style="background: linear-gradient(135deg, #059669, #0f172a);">
        <div>
          <h4>🎯 AZ ELSŐ 30 NAP HIVATALOS KPI CÉLKITŰZÉSE:</h4>
          <p>30 napon belül legalább 150 releváns személy/kkv/cég megkeresése és közülük legalább 2 minősített online meeting lebeszélése a naptárunkba!</p>
        </div>
        <div class="callout-val" style="color: #4ade80;">
          150 / 2
          <small>LEAD / MEETING</small>
        </div>
      </div>

      <div class="timeline" style="margin: 12px 0;">
        <div class="timeline-step active">
          <div class="step-num">1. HÉT</div>
          <div class="step-title">Felkészülés &amp; Lista</div>
          <div class="step-desc">Eszközök beállítása, <code>backlineit.hu</code> demók átnézése, az első 50 fős célközönség lista összeállítása.</div>
        </div>

        <div class="timeline-step active">
          <div class="step-num">2. HÉT</div>
          <div class="step-title">Első Megkeresések</div>
          <div class="step-desc">Napi 8-10 megkeresés elindítása LinkedInen és emailben. Első válaszok kezelése.</div>
        </div>

        <div class="timeline-step active">
          <div class="step-num">3. HÉT</div>
          <div class="step-title">Follow-up &amp; Meeting</div>
          <div class="step-desc">Aktív utánkövetés, kifogáskezelés alkalmazása, az 1. meeting lefoglalása a naptárba.</div>
        </div>

        <div class="timeline-step active">
          <div class="step-num">4. HÉT</div>
          <div class="step-title">Zárás &amp; 2. Meeting</div>
          <div class="step-desc">A 150-es megkeresési keret teljesítése, 2. meeting lebeszélése, első ajánlatkérések átadása.</div>
        </div>
      </div>

      <h3 style="font-size: 12.5px; font-weight: 700; color: #0f172a; margin: 12px 0 6px 0;">Középtávú Növekedési Célok (60–90 Nap)</h3>

      <div class="grid-2">
        <div class="card" style="padding: 11px 13px;">
          <h4 style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">📅 60 Napos Mérföldkő</h4>
          <p style="font-size: 10px; color: #475569; line-height: 1.4;">
            Összesen 300+ kontakt a CRM-ben, 5-6 megtartott konzultáció, az első 1-2 lezárt egyedi fejlesztési szerződés és az első sikeres jutalékkifizetések a számládra!
          </p>
        </div>

        <div class="card" style="padding: 11px 13px;">
          <h4 style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">🚀 90 Napos Mérföldkő</h4>
          <p style="font-size: 10px; color: #475569; line-height: 1.4;">
            Az első havidíjas megbízások (karbantartás, automatizáció) beélesítése. Elindul a havi ismétlődő passzív jövedelmed, és megnyílik az út a céges marketingbüdzsé bevonása felé.
          </p>
        </div>
      </div>

      <div class="quote-box" style="margin-top: 6px;">
        "A 150 megkeresés/hó teljesen elérhető: mindössze heti 35-40, azaz napi 7-8 levélről beszélünk. A fegyelmezett napi rutin a B2B sales legnagyobb titka."
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>13. Oldal / 14</span>
    </div>
  </div>

  <!-- ==================== OLDAL 14: GYIK, KAPCSOLATTARTÁS & ZÁRÓ SZÓ ==================== -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="header-brand"><span class="dot"></span> Backline IT • Marketing Playbook</div>
        <div class="header-section">11. Fejezet: GYIK &amp; Kapcsolat</div>
      </div>

      <div class="section-title-wrap">
        <div class="section-tag">Összegzés &amp; Indulás</div>
        <h2 class="section-title">Gyakran Ismételt Kérdések &amp; Kapcsolattartás</h2>
        <p class="section-desc">
          Itt találod a legfontosabb válaszokat az operatív működésről, valamint a közvetlen elérhetőségeket az induláshoz.
        </p>
      </div>

      <div class="card" style="margin-bottom: 8px; padding: 10px 12px;">
        <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
          Q: Mi történik, ha egy leaddel nehéz időpontot egyeztetni?
        </h4>
        <p style="font-size: 10px; color: #475569; line-height: 1.4;">
          <strong>A:</strong> Használd a dedikált online naptárlinkünket (Calendly / Cal.com integráció), amit közvetlenül elküldhetsz neki, így ő maga tudja kiválasztani a számára legkényelmesebb időpontot.
        </p>
      </div>

      <div class="card" style="margin-bottom: 8px; padding: 10px 12px;">
        <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
          Q: Ha a kliens később újabb projektet rendel, azért is kapok jutalékot?
        </h4>
        <p style="font-size: 10px; color: #475569; line-height: 1.4;">
          <strong>A:</strong> IGEN! Mivel az ügyfél a te nevedhez van rendelve a CRM-ben, minden későbbi fejlesztési megbízásuk és bővítésük után is megkapod a 15%-os részesedésedet.
        </p>
      </div>

      <div class="card" style="margin-bottom: 8px; padding: 10px 12px;">
        <h4 style="font-size: 11.5px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
          Q: Hogyan és mikor kérhetek technikai segítséget?
        </h4>
        <p style="font-size: 10px; color: #475569; line-height: 1.4;">
          <strong>A:</strong> Bármikor! Ha egy érdeklődő olyan bonyolult műszaki kérdést tesz fel, amire nem tudod a választ, soha ne találgass: írd meg, hogy egyeztetsz a technikai vezetővel, és mi azonnal megadjuk a pontos választ.
        </p>
      </div>

      <div class="card dark" style="padding: 12px 16px; margin-top: 10px;">
        <h3 style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 4px;">Közvetlen Kapcsolattartási Csatornák:</h3>
        <p style="font-size: 10.5px; color: #cbd5e1; line-height: 1.5;">
          <strong>Alapító &amp; Rendszerfejlesztő:</strong> Török Norbert<br>
          <strong>Hivatalos Weboldal:</strong> <a href="https://backlineit.hu" style="color: #38bdf8; text-decoration: none;">backlineit.hu</a><br>
          <strong>Szolgáltatások áttekintése:</strong> <a href="https://backlineit.hu/szolgaltatasok" style="color: #38bdf8; text-decoration: none;">backlineit.hu/szolgaltatasok</a><br>
          <strong>Referenciák &amp; Demók:</strong> <a href="https://backlineit.hu/referenciak" style="color: #38bdf8; text-decoration: none;">backlineit.hu/referenciak</a><br>
          <strong>Napi kommunikáció:</strong> Közvetlen telefon, céges email és dedikált chat
        </p>
      </div>

      <div style="text-align: center; margin-top: 10px;">
        <p style="font-size: 12px; font-weight: 800; color: #0f172a;">Sikeres ügyfélszerzést és eredményes partnerséget kívánunk!</p>
        <p style="font-size: 10.5px; color: #2563eb; font-weight: 600; margin-top: 2px;">Backline IT Team • 2026</p>
      </div>
    </div>

    <div class="page-footer">
      <span>Backline IT • Marketing Playbook</span>
      <span>14. Oldal / 14</span>
    </div>
  </div>

</body>
</html>
"""

def generate_pdf():
    output_pdf = r"c:\Users\Török Norbert\.gemini\antigravity\scratch\webpage 2.0\BacklineIT_Marketing_Kezikonyv_Playbook.pdf"
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
