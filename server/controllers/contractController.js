require('dotenv').config();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const marked = require('marked');
const PDFDocument = require('pdf-lib').PDFDocument;
const Contract = require('../models/Contract');
const { ensureTempDir } = require('../utils/fileUtils');
const express = require("express");
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const { generateContractPDF } = require("../utils/pdfGenerator");
const { sendContractEmails } = require("../utils/emailService");
const { exec } = require('child_process');

// Validate required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'EMAIL',
  'EMAIL_PASSWORD',
  'PORT',
  'BASE_URL',
  'PINATA_API_KEY',
  'PINATA_SECRET_API_KEY'
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Setup nodemailer transporter with SMTP settings for Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'contractify2025@gmail.com',
    pass: 'bdmo ukbw lytz izmx'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify SMTP connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

// Controller functions
const getContractsByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    console.log('Fetching contracts for email:', email);
    
    const contracts = await Contract.find({
      $or: [
        { contractorEmail: email },
        { contracteeEmail: email }
      ]
    });
    
    console.log('Found contracts:', contracts.length);
    console.log('Sample contract:', contracts[0] ? {
      id: contracts[0]._id,
      status: contracts[0].status,
      category: contracts[0].contractCategory
    } : 'No contracts found');
    
    // Return the contracts array directly
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getContractById = async (req, res) => {
  try {
    const contractId = req.params.id;
    if (!contractId) return res.status(400).json({ error: 'Contract ID is required' });
    
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    res.json({ contract });
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createContract = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  // Validate required fields
  const requiredFields = [
    'contractCategory',
    'contractor',
    'contractee',
    'contractorEmail',
    'contracteeEmail',
    'contractValue',
    'startDate',
    'endDate',
    'contractDescription'
  ];

  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    console.error('Missing required fields:', missingFields);
    return res.status(400).json({ 
      error: 'Missing required fields',
      missingFields 
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log('Creating new contract with data:', req.body);
    
    const contract = new Contract({
      ...req.body,
      contractCreationDate: new Date(),
      status: "Pending",
      cids: [] // Initialize empty CIDs array
    });
    
    console.log('Saving contract to database...');
    const savedContract = await contract.save({ session });
    console.log('Contract saved successfully:', savedContract._id);

    // Generate and upload PDF to IPFS via Pinata
    console.log('Generating PDF for contract...');
    let cid;
    let txHash;
    try {
      cid = await generateContractPDF(savedContract);
      console.log('PDF generated and uploaded to IPFS. CID:', cid);
      
      // Update contract with CID
      savedContract.cids.push(cid);
      await savedContract.save({ session });
      console.log('Updated contract with CID');

      // Instead of direct blockchain interaction, use API endpoint
      // await storeCIDOnChain(contractId, cid);
      
      // Log contract details with CID
      console.log('Contract Details:', {
        contractId: savedContract._id,
        category: savedContract.contractCategory,
        contractor: savedContract.contractor,
        contractee: savedContract.contractee,
        value: savedContract.contractValue,
        startDate: savedContract.startDate,
        endDate: savedContract.endDate,
        ipfsCID: cid,
        blockchainTxHash: txHash
      });
    } catch (pdfError) {
      console.error('Error generating PDF or storing on blockchain:', pdfError);
      // If PDF generation or blockchain storage fails, we should still save the contract but log the error
      console.error('Contract created but PDF/blockchain operation failed:', pdfError.message);
    }

    // Send email notifications
    console.log('Sending email notifications...');
    try {
      await sendContractEmails(savedContract);
      console.log('Email notifications sent');
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't throw here, as the contract is already created
    }

    await session.commitTransaction();
    session.endSession();

    res.json({ 
      contract: savedContract,
      message: "Contract created successfully",
      pdfUrl: `${process.env.BASE_URL}/contracts/${savedContract._id}/pdf`,
      ipfsUrl: cid ? `https://ipfs.io/ipfs/${cid}` : null,
      cid: cid,
      blockchainTxHash: txHash // Include transaction hash in response
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Detailed error in createContract:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Failed to create contract',
      details: error.message 
    });
  }
};

const acceptContract = async (req, res) => {
  try {
    const contractId = req.params.id;
    const contract = await Contract.findById(contractId);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    contract.status = "Accepted";
    await contract.save();

    res.json({ message: 'Contract accepted successfully' });
  } catch (error) {
    console.error('Error accepting contract:', error);
    res.status(500).json({ error: 'Failed to accept contract' });
  }
};

const rejectContract = async (req, res) => {
  try {
    const contractId = req.params.id;
    const contract = await Contract.findById(contractId);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    contract.status = "Rejected";
    await contract.save();

    res.json({ message: 'Contract rejected successfully' });
  } catch (error) {
    console.error('Error rejecting contract:', error);
    res.status(500).json({ error: 'Failed to reject contract' });
  }
};

const signContractByContractor = async (req, res) => {
  try {
    const contractId = req.params.id;
    const contract = await Contract.findById(contractId);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    contract.status = "Signed by Contractor";
    contract.signedBy.push('contractor');
    contract.contractorSignature = req.body.signature;
    await contract.save();

    // Generate and upload new version of PDF to IPFS
    console.log('Generating updated PDF after contractor signature...');
    const cid = await generateContractPDF(contract);
    console.log('Updated PDF uploaded to IPFS. CID:', cid);
    
    // Add new CID to contract's history
    contract.cids.push(cid);
    await contract.save();

    // Store new CID on blockchain
    console.log('Storing new CID on blockchain...');
    const txHash = await storeCIDOnChain(contract._id.toString(), cid);
    console.log('New CID stored on blockchain. Transaction hash:', txHash);

    // Log contract signing details
    console.log('Contract Signed by Contractor:', {
      contractId: contract._id,
      contractor: contract.contractor,
      contractorEmail: contract.contractorEmail,
      ipfsCID: cid,
      blockchainTxHash: txHash,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      message: 'Contract signed by contractor successfully',
      ipfsUrl: `https://ipfs.io/ipfs/${cid}`,
      cid: cid,
      blockchainTxHash: txHash
    });
  } catch (error) {
    console.error('Error signing contract:', error);
    res.status(500).json({ error: 'Failed to sign contract' });
  }
};

const signContractByContractee = async (req, res) => {
  try {
    const contractId = req.params.id;
    const contract = await Contract.findById(contractId);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    contract.status = "Signed by Contractee";
    contract.signedBy.push('contractee');
    contract.contracteeSignature = req.body.signature;
    await contract.save();

    // Generate and upload new version of PDF to IPFS
    console.log('Generating updated PDF after contractee signature...');
    const cid = await generateContractPDF(contract);
    console.log('Updated PDF uploaded to IPFS. CID:', cid);
    
    // Add new CID to contract's history
    contract.cids.push(cid);
    await contract.save();

    // Store new CID on blockchain
    console.log('Storing new CID on blockchain...');
    const txHash = await storeCIDOnChain(contract._id.toString(), cid);
    console.log('New CID stored on blockchain. Transaction hash:', txHash);

    // Log contract signing details
    console.log('Contract Signed by Contractee:', {
      contractId: contract._id,
      contractee: contract.contractee,
      contracteeEmail: contract.contracteeEmail,
      ipfsCID: cid,
      blockchainTxHash: txHash,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      message: 'Contract signed by contractee successfully',
      ipfsUrl: `https://ipfs.io/ipfs/${cid}`,
      cid: cid,
      blockchainTxHash: txHash
    });
  } catch (error) {
    console.error('Error signing contract:', error);
    res.status(500).json({ error: 'Failed to sign contract' });
  }
};

const generatePDFForExistingContract = async (req, res) => {
  try {
    const contractId = req.params.id;
    const { transactionHash, contractAddress } = req.body;
    const contract = await Contract.findById(contractId);
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Log incoming request details
    console.log('\n=== PDF Generation Request ===');
    console.log('Contract ID:', contractId);
    console.log('Original Transaction Hash:', transactionHash);
    console.log('Contract Address:', contractAddress);
    console.log('Current CIDs:', contract.cids);
    console.log('============================\n');

    // Generate and upload PDF to IPFS with transaction hash and contract address
    console.log('Generating PDF with blockchain details...');
    const cid = await generateContractPDF(contract, transactionHash, contractAddress);
    console.log('New IPFS CID generated:', cid);

    // Update contract with new CID
    contract.cids.push(cid);
    await contract.save();
    console.log('Contract updated with new CID');

    // Store new CID on blockchain
    console.log('\n=== Storing CID on Blockchain ===');
    const txHash = await storeCIDOnChain(contract._id.toString(), cid);
    console.log('Transaction Hash:', txHash);
    console.log('Contract ID:', contract._id.toString());
    console.log('IPFS CID:', cid);
    console.log('==============================\n');

    // Log complete transaction details
    console.log('\n=== Complete Transaction Details ===');
    console.log({
      contractId: contract._id,
      category: contract.contractCategory,
      status: contract.status,
      originalTransactionHash: transactionHash,
      newTransactionHash: txHash,
      contractAddress: contractAddress,
      ipfsCID: cid,
      allCIDs: contract.cids,
      timestamp: new Date().toISOString()
    });
    console.log('================================\n');

    res.json({ 
      message: 'PDF generated successfully',
      cid,
      pdfUrl: `https://ipfs.io/ipfs/${cid}`,
      blockchainTxHash: txHash,
      contractDetails: {
        id: contract._id,
        category: contract.contractCategory,
        status: contract.status,
        originalTransactionHash: transactionHash,
        contractAddress: contractAddress
      }
    });
  } catch (error) {
    console.error('\n=== Error in PDF Generation ===');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    console.error('Stack Trace:', error.stack);
    console.error('============================\n');
    
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      details: error.message
    });
  }
};

const updateContractStatusToExpired = async (req, res) => {
  try {
    console.log("Updating expired contracts...");
    const currentDate = new Date();
    
    const result = await Contract.updateMany(
      { 
        endDate: { $lt: currentDate },
        status: { $ne: "Expired" }
      },
      { $set: { status: "Expired" } }
    );
    
    const expiredCount = await Contract.countDocuments({ status: "Expired" });
    
    res.json({ 
      success: true, 
      result,
      totalExpired: expiredCount
    });
  } catch (error) {
    console.error("Error updating contracts:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
};

module.exports = {
  getContractsByEmail,
  getContractById,
  createContract,
  acceptContract,
  rejectContract,
  signContractByContractor,
  signContractByContractee,
  generatePDFForExistingContract,
  updateContractStatusToExpired
};