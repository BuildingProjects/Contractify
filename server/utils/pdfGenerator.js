const PDFDocument = require('pdf-lib').PDFDocument;
const fs = require('fs');
const path = require('path');
const { uploadToIPFS } = require('./ipfsUtils');

const generateContractPDF = async (contract, transactionHash = null, contractAddress = null) => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Add contract details to the PDF
    const content = `
CONTRACT DETAILS

Category: ${contract.contractCategory}
Contract ID: ${contract._id}
Creation Date: ${contract.contractCreationDate.toLocaleDateString()}

PARTIES
Contractor: ${contract.contractor}
Contractor Email: ${contract.contractorEmail}
Contractee: ${contract.contractee}
Contractee Email: ${contract.contracteeEmail}

CONTRACT INFORMATION
Value: ${contract.contractValue}
Start Date: ${contract.startDate.toLocaleDateString()}
End Date: ${contract.endDate.toLocaleDateString()}
Status: ${contract.status}

DESCRIPTION
${contract.contractDescription}

SIGNATURES
${contract.contractorSignature ? 'Contractor Signature: [Signed]' : 'Contractor Signature: [Pending]'}
${contract.contracteeSignature ? 'Contractee Signature: [Signed]' : 'Contractee Signature: [Pending]'}

BLOCKCHAIN VERIFICATION
${transactionHash ? `Transaction Hash: ${transactionHash}` : 'Transaction Hash: Not Available'}
${contractAddress ? `Contract Address: ${contractAddress}` : 'Contract Address: Not Available'}
`;

    // Add the content to the page
    page.drawText(content, {
      x: 50,
      y: height - 100,
      size: 12,
      maxWidth: width - 100,
    });

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Save PDF to temp file
    const pdfBytes = await pdfDoc.save();
    const tempFilePath = path.join(tempDir, `contract_${contract._id}.pdf`);
    fs.writeFileSync(tempFilePath, pdfBytes);

    // Upload PDF to IPFS
    const ipfsResponse = await uploadToIPFS(tempFilePath);

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    // Return the IPFS CID
    return ipfsResponse.IpfsHash;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

module.exports = {
  generateContractPDF
}; 