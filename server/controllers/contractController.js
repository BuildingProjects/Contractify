const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Contract = require("../models/Contract");
const { ContractorUser, ContracteeUser } = require("../models/User");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const puppeteer = require("puppeteer");
const axios = require("axios");
// const ImageKit = require("imagekit");

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
//       startDate,s
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
  try {
    console.log("Incoming request params:", req.params);
    console.log("User role:", req.user?.role); // Debugging role

    const { email } = req.params; // Extract email from URL

    if (!email) {
      console.log("Error: Email is missing in request params");
      return res.status(400).json({ message: "Email is required" });
    }

    if (!req.user || !req.user.role) {
      console.log("Error: User role is missing");
      return res
        .status(403)
        .json({ message: "Unauthorized: Role is required" });
    }

    let query = {};

    // Check if the user is a contractor or contractee
    if (req.user.role === "Contractor") {
      query = { contractorEmail: email };
    } else if (req.user.role === "Contractee") {
      query = { contracteeEmail: email };
    } else {
      return res.status(403).json({ message: "Unauthorized: Invalid role" });
    }

    console.log("Query being executed:", query); // Debug query before execution

    const contracts = await Contract.find(query);

    console.log("Contracts found:", contracts.length);

    res.status(200).json({ contracts });
  } catch (error) {
    console.error("Error fetching contracts:", error);
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

async function generateContract(contractDetails) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Generate a formal contract using the provided details:
    Contract Category: ${contractDetails.contractCategory}
    Contractor Name: ${contractDetails.contractor}
    Contractee Name: ${contractDetails.contractee}
    Contractor Email: ${contractDetails.contractorEmail}
    Contractee Email: ${contractDetails.contracteeEmail}
    Start Date: ${contractDetails.startDate}
    End Date: ${contractDetails.endDate}
    Contract Value: ${contractDetails.contractValue}
    Contract Creation Date: ${contractDetails.contractCreationDate}
    Contract Description: ${contractDetails.contractDescription}
    Additional Terms: ${JSON.stringify(contractDetails.dynamicFields)}

    Provide a structured contract format with necessary legal terms. Ensure all provided details are accurately included.Do not include any unneccessary details like witnesses and signatures.`;

    const response = await model.generateContent(prompt);
    const contractText = convertMarkdownToHTML(response.response.text());

    console.log("Generated Contract Text:", contractText); // Debugging

    // Generate PDF using direct contract details
    const pdfPath = await generatePDF(contractDetails, contractText);

    return { success: true, pdfPath };
  } catch (error) {
    console.error("Error generating contract:", error);
    return { success: false, message: "Failed to generate contract." };
  }
}

function generatePDF(contractDetails, contractText) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", async () => {
        const pdfBuffer = Buffer.concat(buffers);

        try {
          const uploadResponse = await imagekit.upload({
            file: pdfBuffer,
            fileName: `${contractDetails.contractorEmail}_contract.pdf`,
            folder: "/contracts/",
          });

          resolve(uploadResponse.url);
        } catch (uploadError) {
          console.error("Error uploading PDF:", uploadError);
          reject(uploadError);
        }
      });

      // **Title**
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("Contract under Contractify", { align: "center" })
        .moveDown(2);

      // **Contract Details - Using contractDetails directly**
      const addSection = (title, content) => {
        doc.fontSize(14).font("Helvetica-Bold").text(title);
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(content || "N/A")
          .moveDown();
      };

      const formatAdditionalTerms = (dynamicFields) => {
        if (!dynamicFields || Object.keys(dynamicFields).length === 0) {
          return "None";
        }
        return Object.entries(dynamicFields)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
      };

      addSection("Contract Category:", contractDetails.contractCategory);
      addSection("Contractor Name:", contractDetails.contractor);
      addSection("Contractee Name:", contractDetails.contractee);
      addSection("Contractor Email:", contractDetails.contractorEmail);
      addSection("Contractee Email:", contractDetails.contracteeEmail);
      addSection("Start Date:", contractDetails.startDate);
      addSection("End Date:", contractDetails.endDate);
      addSection("Contract Value:", contractDetails.contractValue);
      addSection(
        "Contract Creation Date:",
        contractDetails.contractCreationDate
      );
      addSection("Contract Description:", contractDetails.contractDescription);
      addSection(
        "Additional Terms:",
        formatAdditionalTerms(contractDetails.dynamicFields)
      );

      doc.moveDown(2);

      // **Full Contract Text**
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Contract Terms & Conditions:");
      doc.fontSize(12).font("Helvetica").text(contractText).moveDown(3);

      // **Signature Section**
      let yPosition = doc.y + 50;

      if (contractDetails.contractorSignature?.digital) {
        try {
          const response = await axios.get(
            contractDetails.contractorSignature.digital,
            {
              responseType: "arraybuffer",
            }
          );
          const signatureBuffer = Buffer.from(response.data, "binary");

          doc.image(signatureBuffer, 100, yPosition, { width: 150 });
          doc.fontSize(12).text("Contractor Signature", 100, yPosition + 50);
        } catch (err) {
          console.error("Error fetching contractor signature:", err);
        }
      }

      if (contractDetails.contracteeSignature?.digital) {
        try {
          const response = await axios.get(
            contractDetails.contracteeSignature.digital,
            {
              responseType: "arraybuffer",
            }
          );
          const signatureBuffer = Buffer.from(response.data, "binary");

          doc.image(signatureBuffer, 350, yPosition, { width: 150 });
          doc.fontSize(12).text("Contractee Signature", 350, yPosition + 50);
        } catch (err) {
          console.error("Error fetching contractee signature:", err);
        }
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
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
    const { digitalSignature, photoSignature } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (!contract)
      return res.status(404).json({ message: "Contract not found" });

    if (!contract.signedBy.includes("contractor")) {
      return res.status(400).json({ message: "Contractor must sign first" });
    }

    if (contract.signedBy.includes("contractee")) {
      return res
        .status(400)
        .json({ message: "Contract already signed by contractee" });
    }

    contract.contracteeSignature.digital = digitalSignature;
    contract.contracteeSignature.photo = photoSignature;
    contract.signedBy.push("contractee");
    contract.status = "Signed by Both";

    await contract.save();

    // Generate signed contract PDF
    await generateContractPDF(contract._id);

    // Notify both parties
    await sendEmail(
      contract.contractorEmail,
      "Contract Fully Signed",
      `<p>The contract has been signed by both parties. You can download the signed contract.</p>`
    );

    await sendEmail(
      contract.contracteeEmail,
      "Contract Fully Signed",
      `<p>The contract has been signed by both parties. You can download the signed contract.</p>`
    );

    res.status(200).json({ message: "Contract signed by contractee" });
  } catch (error) {
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
