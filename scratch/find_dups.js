const fs = require('fs');

function findDuplicateKeys(jsonStr) {
    const keys = [];
    const duplicates = [];
    
    // Simple regex to find keys at the first level of indentation (2 spaces)
    const regex = /^  "([^"]+)":/gm;
    let match;
    while ((match = regex.exec(jsonStr)) !== null) {
        const key = match[1];
        if (keys.includes(key)) {
            duplicates.push(key);
        } else {
            keys.push(key);
        }
    }
    return duplicates;
}

const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf8');
const dups = findDuplicateKeys(content);
console.log(JSON.stringify(dups));
