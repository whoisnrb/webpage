const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Configuration
const OUTPUT_FILE = 'BacklineIT_Documentation.pdf';
const IGNORE_DIRS = ['node_modules', '.git', '.next', '.vscode', 'dist', 'build', '.gemini', '.idea'];
const ROOT_DIR = path.resolve(__dirname, '..');

// Descriptions for known directories to add context
const DIRECTORY_DESCRIPTIONS = {
    'src/app': 'Main Application Router. Contains pages, layouts, and API routes.',
    'src/app/[locale]': 'Internationalized routes (En/Hu).',
    'src/actions': 'Server Actions for form handling and backend logic (Registration, Login).',
    'src/components': 'Reusable UI components.',
    'src/components/ui': 'Base UI elements (Buttons, Inputs) - mostly shadcn/ui.',
    'src/components/sections': 'Large page sections (Hero, Features, Pricing).',
    'src/lib': 'Utility functions, database connection (prisma), and helpers.',
    'prisma': 'Database schema and seed scripts.',
    'messages': 'Translation files (JSON) for i18n.',
    'public': 'Static assets (images, fonts).',
    'src/config': 'Configuration files (e.g., Landing Page definitions).'
};

// Descriptions for specific important files
const FILE_DESCRIPTIONS = {
    'package.json': 'Project dependencies and scripts.',
    'next.config.ts': 'Next.js configuration.',
    'prisma/schema.prisma': 'Database model definitions (User, Referral, Product).',
    'src/middleware.ts': 'Request middleware (Auth checks, i18n routing).',
    'src/app/[locale]/layout.tsx': 'Root layout, includes Providers and Analytics.',
    'src/app/[locale]/page.tsx': 'Home page.',
    'src/config/landing-pages.ts': 'Configuration for dynamic landing pages.',
    'src/actions/register.ts': 'User registration logic with Referral handling.',
    'src/components/analytics/google-tags.tsx': 'Google Tag Manager integration.'
};

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (IGNORE_DIRS.includes(f) || f.startsWith('.')) return;
        callback(dirPath, isDirectory);
        if (isDirectory) {
            walkDir(dirPath, callback);
        }
    });
}

function generatePDF() {
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(OUTPUT_FILE));

    // Title Page
    doc.fontSize(25).text('BacklineIT Weboldal Dokumentáció', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Generálva: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(4);
    doc.fontSize(14).text('Ez a dokumentum a projekt fájljainak és mappáinak technikai leírását tartalmazza.', { align: 'center' });
    doc.addPage();

    // Content
    doc.fontSize(18).text('Fájl Struktúra és Leírások', { underline: true });
    doc.moveDown();

    const relativeRoot = ROOT_DIR;

    // Custom walker to organize by folders better
    const processDirectory = (currentPath, indent = 0) => {
        const files = fs.readdirSync(currentPath).sort((a, b) => {
            // Dirs first
            const aStat = fs.statSync(path.join(currentPath, a)).isDirectory();
            const bStat = fs.statSync(path.join(currentPath, b)).isDirectory();
            if (aStat && !bStat) return -1;
            if (!aStat && bStat) return 1;
            return a.localeCompare(b);
        });

        files.forEach(file => {
            if (IGNORE_DIRS.includes(file) || file.startsWith('.')) return;

            const fullPath = path.join(currentPath, file);
            const relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
            const isDir = fs.statSync(fullPath).isDirectory();
            const level = relativePath.split('/').length;

            // Indentation visual
            const prefix = isDir ? '📁 ' : '📄 ';

            // Text color/size based on depth
            if (level === 1) {
                doc.moveDown(0.5);
                doc.font('Helvetica-Bold').fontSize(12).text(relativePath, { continued: false });
            } else {
                doc.font('Helvetica').fontSize(10).text('  '.repeat(level - 1) + prefix + file, { continued: false });
            }

            // Add description if exists
            let desc = DIRECTORY_DESCRIPTIONS[relativePath] || FILE_DESCRIPTIONS[relativePath];
            if (desc) {
                doc.font('Helvetica-Oblique').fontSize(9).fillColor('grey')
                    .text('  '.repeat(level) + 'ℹ️ ' + desc);
                doc.fillColor('black'); // Reset
            }

            if (isDir) {
                processDirectory(fullPath, indent + 1);
            }
        });
    };

    processDirectory(ROOT_DIR);

    // Finalize
    doc.end();
    console.log(`PDF dokumentáció elkészült: ${OUTPUT_FILE}`);
}

generatePDF();
