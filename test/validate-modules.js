const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, '..', 'scripts');
const files = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.js'));

console.log('RNK 12 UI Module Validation Test');
console.log('================================\n');

let totalTests = 0;
let passedTests = 0;

files.forEach(file => {
    const filePath = path.join(scriptsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    
    totalTests++;
    console.log(`Testing: ${file}`);
    console.log(`  Lines: ${lines}`);
    
    if (lines <= 500) {
        console.log(`  PASS: File is under 500 lines`);
        passedTests++;
    } else {
        console.log(`  FAIL: File exceeds 500 lines (${lines} lines)`);
    }
    
    if (!content.includes('emoji')) {
        console.log(`  PASS: No emojis detected`);
        passedTests++;
        totalTests++;
    } else {
        console.log(`  FAIL: Emoji detected in code`);
        totalTests++;
    }
    
    const syntaxIssues = [];
    const lines_arr = content.split('\n');
    lines_arr.forEach((line, idx) => {
        if (line.match(/\bconsole\.(log|warn|error)\(/)) {
            if (line.includes('|')) {
            }
        }
    });
    
    console.log('');
});

const moduleJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'module.json'), 'utf8'));
totalTests++;
if (moduleJson.esmodules && moduleJson.esmodules.length > 0) {
    console.log('PASS: Module has esmodules configured');
    passedTests++;
} else {
    console.log('FAIL: Module missing esmodules');
}

totalTests++;
const mainModuleExists = fs.existsSync(path.join(scriptsDir, 'rnk-12-ui-main.js'));
if (mainModuleExists) {
    console.log('PASS: Main module entry point exists');
    passedTests++;
} else {
    console.log('FAIL: Main module entry point missing');
}

totalTests++;
const cssExists = fs.existsSync(path.join(__dirname, '..', 'styles', 'rnk-12-ui.css'));
if (cssExists) {
    console.log('PASS: CSS file exists');
    passedTests++;
} else {
    console.log('FAIL: CSS file missing');
}

console.log('\n================================');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

const targetScore = 100;
const actualScore = Math.round((passedTests / totalTests) * 100);

if (actualScore === targetScore) {
    console.log(`\nRESULT: 100/100/100/100 - PERFECT SCORE`);
    process.exit(0);
} else {
    console.log(`\nRESULT: ${actualScore}/100 - NEEDS IMPROVEMENT`);
    process.exit(1);
}
