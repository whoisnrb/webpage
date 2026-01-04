const http = require('http');

const data = JSON.stringify({
    action: 'feedback',
    email: 'whoisnrb@gmail.com',
    name: 'Migration Test Bot',
    feedback: 'Ez egy automatikus teszt üzenet a "Vercel-native" migráció ellenőrzésére. Ha ezt látod a Google Sheet-ben és kaptál emailt, akkor A RENDSZER MŰKÖDIK! 🚀'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/unified',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

console.log('⏳ Teszt kérés küldése a http://localhost:3000/api/unified címre...');

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);

    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
        console.log('VÁLASZ:', responseData);
        if (res.statusCode === 200) {
            console.log('✅ SIKER! Ellenőrizd az e-mail fiókodat és a Google Sheetet.');
        } else {
            console.log('❌ Hiba történt. Ellenőrizd a szerver logokat.');
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ HIBA: Nem sikerült csatlakozni a szerverhez. Fut a 'npm run dev'?\nHibaüzenet: ${e.message}`);
});

req.write(data);
req.end();
