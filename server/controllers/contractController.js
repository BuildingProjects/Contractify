const nodemailer = require("nodemailer");
const Contract = require("../models/Contract");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSKEY,
  },
});

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
const createContract = async (req, res) => {
  try {
    const {
      contractor,
      contractorEmail,
      contracteeEmail,
      startDate,
      endDate,
      status,
      ...dynamicFields
    } = req.body;

    const newContract = new Contract({
      contractor,
      contractorEmail,
      contracteeEmail,
      startDate,
      endDate,
      status: "Pending",
      dynamicFields,
    });

    await newContract.save();

    //send email to contractee
    const acceptUrl = `http://localhost:5000/api/contracts/acceptContract/${newContract._id}`;
    const rejectUrl = `http://localhost:5000/api/contracts/rejectContract/${newContract._id}`;

    await sendEmail(
      contracteeEmail,
      "New Contract Issued",
      `<p>You have received a new contract from ${contractor}.</p>
      <p>Click below to accept or reject:</p>
      <a href="${acceptUrl}">Accept Contract</a> | <a href="${rejectUrl}">Reject Contract</a>`
    );

    res
      .status(201)
      .json({ message: "Contract created succesfully", contract: newContract });
  } catch (error) {
    console.error("Error creating contract:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get contracts by email (contractor or contractee)
const getContractsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const contracts = await Contract.find({
      $or: [{ contractorEmail: email }, { contracteeEmail: email }],
    });

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

const generateContractPDF = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract)
      return res.status(404).json({ message: "Contract not found" });

    // Define the directory and ensure it exists
    const contractsDir = path.join(__dirname, "../contracts");
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true }); // Creates the directory if it doesn't exist
    }

    // Define the file path
    const filePath = path.join(contractsDir, `contract_${contract._id}.pdf`);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);

    // Pipe PDF content to file
    doc.pipe(writeStream);

    doc
      .fontSize(20)
      .text("Contract Agreement by Contractify", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Contractor: ${contract.contractor} (${contract.contractorEmail})`);
    doc.text(`Contractee: ${contract.contracteeEmail}`);
    doc.text(`Start Date: ${contract.startDate}`);
    doc.text(`End Date: ${contract.endDate}`);
    doc.text(`Status: ${contract.status}`);
    doc.text(
      `Additional Details: ${JSON.stringify(contract.dynamicFields, null, 2)}`
    );
    doc.end();

    // Ensure the file is fully written before sending
    writeStream.on("finish", () => {
      res.download(filePath);
    });

    writeStream.on("error", (err) => {
      console.error("Error writing PDF:", err);
      res.status(500).json({ message: "Error generating PDF", error: err });
    });
  } catch (error) {
    console.error("Error generating contract PDF:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createContract,
  getContractsByEmail,
  acceptContract,
  rejectContract,
  generateContractPDF,
};
