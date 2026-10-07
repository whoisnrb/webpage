const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Simple .env parser
const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
        }
        env[match[1].trim()] = val;
    }
});

const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
let key = env.GOOGLE_PRIVATE_KEY;

if (key) {
    if (key.startsWith('"') && key.endsWith('"')) {
        key = key.substring(1, key.length - 1);
    }
    key = key.replace(/\\n/g, '\n');
}

async function migrateSubscribers() {
    console.log('Migrating subscribers from Google Sheet...');
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: email,
            private_key: key,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = '1_BNHRpBFvOIWaHy6xg-AZcMp_eMOzR2C1dA9p65fynM'; // NEWSLETTER

    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'A:E',
        });
        const rows = res.data.values || [];
        console.log(`Found ${rows.length} rows in Google Sheet.`);

        const emails = new Set();
        for (const row of rows) {
            if (!row || !row[0]) continue;
            const val = row[0].trim().toLowerCase();
            if (val === 'email' || !val.includes('@')) continue;
            emails.add(val);
        }

        console.log(`Unique emails found: ${emails.size}`);

        for (const targetEmail of emails) {
            // Upsert in NewsletterSubscriber
            await prisma.newsletterSubscriber.upsert({
                where: { email: targetEmail },
                create: {
                    email: targetEmail,
                    active: true,
                    source: 'google-sheet-import',
                },
                update: {
                    active: true,
                },
            });

            // Also ensure it exists in Lead table with source 'newsletter'
            const existingLead = await prisma.lead.findUnique({
                where: { email: targetEmail },
            });
            if (!existingLead) {
                await prisma.lead.create({
                    data: {
                        email: targetEmail,
                        source: 'Hírlevél',
                        status: 'LEAD',
                    },
                });
            }
        }

        const count = await prisma.newsletterSubscriber.count();
        console.log(`Successfully migrated! Total NewsletterSubscribers in DB: ${count}`);
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

migrateSubscribers();
