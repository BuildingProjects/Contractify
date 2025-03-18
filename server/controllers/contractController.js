const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Contract = require("../models/Contract");
const { ContractorUser, ContracteeUser } = require("../models/User");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const puppeteer = require("puppeteer");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSKEY,
  },
});
const ImageKit = require("imagekit");
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const saveSignature = async (req, res) => {
  try {
    const { signature } = req.body;

    if (!signature) {
      return res.status(400).json({ error: "Signature is required" });
    }

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: signature, // Base64 string
      fileName: `signature_${Date.now()}.png`, // Unique filename
      folder: "/signatures/",
    });

    res.status(200).json({
      message: "Signature uploaded successfully",
      url: uploadResponse.url,
    });
  } catch (error) {
    console.error("Save Signature Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//function to send email
const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Contract Management" ${process.env.EMAIL}`,
    to,
    subject,
    html,
  });
};

// Create a new contract
// const createContract = async (req, res) => {
//   try {
//     const {
//       contractor,
//       contractee,
//       contractorEmail,
//       contracteeEmail,
//       contractCategory,
//       contractValue,
//       contractCreationDate,
//       startDate,
//       endDate,
//       contractDescription,
//       status,
//       ...dynamicFields
//     } = req.body;

//     // Check if contractee email exists in the database
//     const existingContractee = await ContracteeUser.findOne({
//       email: contracteeEmail,
//     });
//     if (!existingContractee) {
//       return res
//         .status(404)
//         .json({ message: "Contractee email not found in the database" });
//     }

//     const newContract = new Contract({
//       contractor,
//       contractee,
//       contractorEmail,
//       contracteeEmail,
//       contractCategory,
//       contractValue,
//       contractCreationDate,
//       startDate,
//       endDate,
//       contractDescription,
//       status: "Pending",
//       dynamicFields,
//     });

//     await newContract.save();

//     //send email to contractee
//     const acceptUrl = `${process.env.BASE_URL}/api/contracts/acceptContract/${newContract._id}`;
//     const rejectUrl = `${process.env.BASE_URL}/api/contracts/rejectContract/${newContract._id}`;

//     await sendEmail(
//       contracteeEmail,
//       "New Contract Issued",
//       `<p>You have received a new contract from ${contractorEmail}.</p>
//       <p>Click below to accept or reject:</p>
//       <a href="${acceptUrl}">Accept Contract</a> | <a href="${rejectUrl}">Reject Contract</a>`
//     );

//     res
//       .status(201)
//       .json({ message: "Contract created succesfully", contract: newContract });
//   } catch (error) {
//     console.error("Error creating contract:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };
const createContract = async (req, res) => {
  try {
    console.log("Received request to create contract", req.body);

    // Destructuring request body
    const {
      contractor,
      contractee,
      contractorEmail,
      contracteeEmail,
      contractCategory,
      contractValue,
      contractCreationDate,
      startDate,
      endDate,
      contractDescription,
      status,
      contractorSignature,
      ...dynamicFields
    } = req.body;

    console.log("Extracted contract details", {
      contractor,
      contractee,
      contractorEmail,
      contracteeEmail,
    });

    // Check if contractee email exists in the database
    console.log("Checking if contractee email exists in the database");
    const existingContractee = await ContracteeUser.findOne({
      email: contracteeEmail,
    });

    if (!existingContractee) {
      console.warn(
        "Contractee email not found in the database",
        contracteeEmail
      );
      return res
        .status(404)
        .json({ message: "Contractee email not found in the database" });
    }

    // Creating new contract object
    console.log("Creating new contract object");
    const newContract = new Contract({
      contractor,
      contractee,
      contractorEmail,
      contracteeEmail,
      contractCategory,
      contractValue,
      contractCreationDate,
      startDate,
      endDate,
      contractDescription,
      contractorSignature: {
        digital: contractorSignature?.digital || "", // Ensure valid storage
        photo: contractorSignature?.photo || "",
      },
      status: "Signed by Contractor", // Default status
      dynamicFields,
    });
    console.log(contractorSignature);

    // Saving contract to the database
    console.log("Saving new contract to the database");
    await newContract.save();
    console.log("Contract saved successfully", newContract._id);

    // Sending email notification to contractee
    const acceptUrl = `${process.env.BASE_URL}/api/contracts/acceptContract/${newContract._id}`;
    const rejectUrl = `${process.env.BASE_URL}/api/contracts/rejectContract/${newContract._id}`;

    console.log("Sending email to contractee", contracteeEmail);
    await sendEmail(
      contracteeEmail,
      "New Contract Issued",
      `<p>You have received a new contract from ${contractorEmail}.</p>
      <p>Click below to accept or reject:</p>
      <a href="${acceptUrl}">Accept Contract</a> | <a href="${rejectUrl}">Reject Contract</a>`
    );
    console.log("Email sent successfully to", contracteeEmail);

    // Sending success response
    res.status(201).json({
      message: "Contract created successfully",
      contract: newContract,
    });
  } catch (error) {
    console.error("Error creating contract:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get  contracts by email (contractor or contractee)
const getContractsByEmail = async (req, res) => {
  // try {
  //   // const email = req.params;
  //   const email = req.body;
  //   // let email = "kumarros2002@gmail.com";
  //   // let query = {
  //   //   $or: [{ contractorEmail: email }, { contracteeEmail: email }],
  //   // };
  //   let query = {
  //     contractorEmail: email,
  //   };
  //   const contracts = await Contract.find(query);
  //   res.status(200).json({ contracts });
  // } catch (error) {
  //   console.error("Error fetching contracts:", error);
  //   res.status(500).json({ message: "Server error", error });
  // }
  try {
    console.log("Incoming request params:", req.params); // Debug request params

    const { email } = req.params; // Extract email from URL

    if (!email) {
      console.log("Error: Email is missing in request params"); // Debug missing email
      return res.status(400).json({ message: "Email is required" });
    }

    let query = {
      contractorEmail: email, // Ensure it's a string
    };

    console.log("Query being executed:", query); // Debug query before execution

    const contracts = await Contract.find(query);

    console.log("Contracts found:", contracts.length); // Debug number of contracts found

    res.status(200).json({ contracts });
  } catch (error) {
    console.error("Error fetching contracts:", error); // Log the actual error
    res.status(500).json({ message: "Server error", error });
  }
};

const acceptContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract)
      return res.status(404).json({ message: "Contract not found" });

    contract.status = "Accepted";
    await contract.save();

    //notify contractor

    await sendEmail(
      contract.contractorEmail,
      "Contract Accepted",
      `<p>Your contract with ${contract.contracteeEmail} has been accepted.</p>`
    );

    res.status(200).json({ message: " Contract accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const rejectContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract)
      return res.status(404).json({ message: "Contract not found" });

    contract.status = "Rejected";
    await contract.save();

    // Notify contractor
    await sendEmail(
      contract.contractorEmail,
      "Contract Rejected",
      `<p>Your contract with ${contract.contracteeEmail} has been rejected.</p>`
    );

    res.status(200).json({ message: "Contract rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Function to convert markdown to HTML
const convertMarkdownToHTML = (text) => {
  return text.replace(/\*\*(.*?)\*\*/g, "$1");
};

// Generate contract PDF content from gemini

async function generateContract(contractDetails) {
  try {
    console.log(contractDetails);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Generate a formal contract template based on the following details:
        Contractor Email: ${contractDetails.contractorEmail}
        Contractee Email: ${contractDetails.contracteeEmail}
        Start Date: ${contractDetails.startTime}
        End Date: ${contractDetails.endTime}
        Additional Terms: ${JSON.stringify(contractDetails.dynamicFields)}

        Provide a structured contract format with necessary legal terms. only include the given details in the contract, do not add or assume extra aspects, do not include any note , comments or suggestions in the contract. `;

    const response = await model.generateContent(prompt);
    const contractText = response.response.text();
    const formattedText = convertMarkdownToHTML(contractText);

    // Generate PDF from contract text
    const pdfPath = await generatePDF(
      formattedText,
      contractDetails.contractorEmail
    );

    return { success: true, pdfPath };
  } catch (error) {
    console.error("Error generating contract:", error);
    return { success: false, message: "Failed to generate contract." };
  }
}

// Function to generate PDF
function generatePDF(contractText, contractorEmail) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const pdfPath = `contracts/${contractorEmail}_contract.pdf`;
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);
    doc.fontSize(12).text(contractText, { align: "left" });
    doc.end();

    stream.on("finish", () => resolve(pdfPath));
    stream.on("error", (err) => reject(err));
  });
}

const generateContractPDF = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const result = await generateContract(contract);

    if (result.success) {
      res.status(200).json({
        message: "Contract PDF generated successfully",
        pdfPath: result.pdfPath,
      });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error generating contract PDF:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const signContractByContractor = async (req, res) => {
  try {
    const { digitalSignature, photoSignature } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (!contract)
      return res.status(404).json({ message: "Contract not found" });

    if (contract.signedBy.includes("contractor")) {
      return res
        .status(400)
        .json({ message: "Contract already signed by contractor" });
    }

    contract.contractorSignature.digital = digitalSignature;
    contract.contractorSignature.photo = photoSignature;
    contract.signedBy.push("contractor");
    contract.status = "Signed by Contractor";

    await contract.save();

    // Send email to contractee to sign
    const signUrl = `${process.env.BASE_URL}/api/contracts/signContract/contractee/${contract._id}`;
    await sendEmail(
      contract.contracteeEmail,
      "Contract Ready for Your Signature",
      `<p>The contract has been signed by ${contract.contractor}. Please sign it.</p>
      <p><a href="${signUrl}">Sign Contract</a></p>`
    );

    res.status(200).json({ message: "Contract signed by contractor" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const signContractByContractee = async (req, res) => {
  try {
    console.log("Received contract signing request:", req.body.contractId);

    const { contractId, contracteeSignature } = req.body;

    if (!contractId) {
      return res.status(400).json({ message: "Contract ID is required" });
    }

    const contract = await Contract.findById(contractId);

    if (!contract) {
      console.warn("Contract not found:", contractId);
      return res.status(404).json({ message: "Contract not found" });
    }
    console.log("url :", contracteeSignature);

    // Store contractee's signature
    contract.contracteeSignature = {
      digital: contracteeSignature,
    };

    // Update contract status
    contract.status = "Ongoing";

    // Save contract
    await contract.save();
    console.log("Contract updated to Ongoing:", contract._id);

    // Notify contract parties
    await sendEmail(
      contract.contractorEmail,
      "Contract Signed & Active",
      `<p>The contract has been signed by the contractee and is now active.</p>`
    );

    await sendEmail(
      contract.contracteeEmail,
      "Contract Signed & Active",
      `<p>You have successfully signed the contract. It is now active.</p>`
    );

    res.status(200).json({ message: "Contract signed successfully" });
  } catch (error) {
    console.error("Error signing contract:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createContract,
  getContractsByEmail,
  acceptContract,
  rejectContract,
  generateContractPDF,
  signContractByContractor,
  signContractByContractee,
  saveSignature,
};
