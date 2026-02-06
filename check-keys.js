const fs = require('fs');

const enData = JSON.parse(fs.readFileSync('./messages/en.json', 'utf8'));
const huData = JSON.parse(fs.readFileSync('./messages/hu.json', 'utf8'));

const enKeys = Object.keys(enData.Services.SysAdmin).sort();
const huKeys = Object.keys(huData.Services.SysAdmin).sort();

console.log('=== KEY COUNT ===');
console.log('EN:', enKeys.length, 'keys');
console.log('HU:', huKeys.length, 'keys');

console.log('\n=== MISSING IN EN ===');
const missingInEn = huKeys.filter(k => !enKeys.includes(k));
if (missingInEn.length === 0) {
    console.log('✅ None! All keys present.');
} else {
    missingInEn.forEach(k => console.log('  ❌', k));
}

console.log('\n=== MISSING IN HU ===');
const missingInHu = enKeys.filter(k => !huKeys.includes(k));
if (missingInHu.length === 0) {
    console.log('✅ None! All keys present.');
} else {
    missingInHu.forEach(k => console.log('  ❌', k));
}

console.log('\n=== STATUS ===');
if (missingInEn.length === 0 && missingInHu.length === 0) {
    console.log('✅ PERFECT! EN and HU have identical keys!');
} else {
    console.log('⚠️  There are still some missing keys.');
}
