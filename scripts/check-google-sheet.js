const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

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

async function checkSheet() {
    console.log('Testing sheet connection with email:', email);
    if (!email || !key) {
        console.log('Missing credentials');
        return;
    }

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
        console.log('Sheet rows:', res.data.values);
    } catch (err) {
        console.error('Sheet fetch error:', err.message);
    }
}

checkSheet();
