const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
require('dotenv').config();

// Initialize Pinata client
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

// Test Pinata authentication
pinata.testAuthentication().then((result) => {
  console.log('Pinata Authentication:', result);
}).catch((err) => {
  console.error('Pinata Authentication Error:', err);
});

const uploadToIPFS = async (filePath) => {
  try {
    const readableStreamForFile = fs.createReadStream(filePath);
    const options = {
      pinataMetadata: {
        name: `Contract-${Date.now()}`,
        keyvalues: {
          type: 'contract',
          timestamp: new Date().toISOString()
        }
      }
    };

    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    console.log('IPFS Hash:', result.IpfsHash);
    return result;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
};

// Function to unpin a file from IPFS if needed
const unpinFromIPFS = async (hashToUnpin) => {
  try {
    await pinata.unpin(hashToUnpin);
    console.log('Successfully unpinned:', hashToUnpin);
    return true;
  } catch (error) {
    console.error('Error unpinning file:', error);
    throw new Error('Failed to unpin file from IPFS');
  }
};

// Function to get pin list
const getPinList = async () => {
  try {
    const filters = {
      status: 'pinned',
      pageLimit: 10,
      pageOffset: 0,
      metadata: {
        keyvalues: {
          type: {
            value: 'contract',
            op: 'eq'
          }
        }
      }
    };
    
    const result = await pinata.pinList(filters);
    return result;
  } catch (error) {
    console.error('Error getting pin list:', error);
    throw new Error('Failed to get pin list from IPFS');
  }
};

module.exports = {
  uploadToIPFS,
  unpinFromIPFS,
  getPinList
}; 