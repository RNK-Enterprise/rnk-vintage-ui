const { execSync } = require('child_process');

console.log('RNK 12 UI Test Suite');
console.log('====================\n');

try {
    console.log('Running module validation...\n');
    execSync('node test/validate-modules.js', { stdio: 'inherit', cwd: __dirname + '/..' });
    
    console.log('\nAll tests passed successfully');
    process.exit(0);
} catch (error) {
    console.error('\nTests failed');
    process.exit(1);
}
