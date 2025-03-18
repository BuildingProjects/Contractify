const fs = require('fs');
const path = require('path');

const ensureTempDir = () => {
    const tempDir = path.join(__dirname, '../controllers/temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    return tempDir;
};

module.exports = {
    ensureTempDir
}; 