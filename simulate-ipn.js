const crypto = require('crypto');

// Configuration
const secretKey = process.env.SIMPLEPAY_SECRET_KEY || 'test_secret_key'; // Use your .env value or a test one
const orderRef = 'ORDER-TEST-123'; // Replace with a real orderRef from your DB if testing manually
const amount = 500000; // 500,000 HUF -> PRO license

// IPN Data
const ipnData = {
    salt: crypto.randomBytes(16).toString('hex'),
    orderRef: orderRef,
    method: 'CARD',
    merchant: 'test_merchant',
    finishDate: new Date().toISOString(),
    paymentDate: new Date().toISOString(),
    transactionId: 'TRANS-123',
    status: 'FINISHED',
};

// Generate Signature
function generateHash(data, key) {
    const orderedData = {};
    Object.keys(data).sort().forEach(k => orderedData[k] = data[k]);
    const dataString = Object.values(orderedData).join('');
    const hashBase = `${key}${dataString}`;
    return crypto.createHash('md5').update(hashBase, 'utf8').digest('hex').toUpperCase();
}

const signature = generateHash(ipnData, secretKey);

console.log('Simulating IPN request...');
console.log('Data:', ipnData);
console.log('Signature:', signature);

// Send Request
fetch('http://localhost:3000/api/payment/ipn', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Signature': signature
    },
    body: JSON.stringify(ipnData)
})
    .then(res => res.json())
    .then(data => console.log('Response:', data))
    .catch(err => console.error('Error:', err));
