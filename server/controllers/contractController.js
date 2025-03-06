const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Contract = require("../models/Contract");
const { ContractorUser, ContracteeUser } = require("../models/User");
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

    // Check if contractee email exists in the database
    const existingContractee = await ContracteeUser.findOne({
      email: contracteeEmail,
    });
    if (!existingContractee) {
      return res
        .status(404)
        .json({ message: "Contractee email not found in the database" });
    }

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
    const acceptUrl = `${process.env.BASE_URL}/api/contracts/acceptContract/${newContract._id}`;
    const rejectUrl = `${process.env.BASE_URL}/api/contracts/rejectContract/${newContract._id}`;

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
    const { email , status } = req.params;
    let query = {
      $or: [{ contractorEmail: email} , { contracteeEmail: email}]
    };

    if(status && status !== all){
      query.status = status;
    }

    const contracts = await Contract.find(query);
    res.status(200).json({ contracts });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    res.status(500).json({ message: "Server error" , error});
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
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // Create contracts directory if it doesn't exist
    const contractsDir = path.join(__dirname, "../contracts");
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true });
    }

    const filePath = path.join(contractsDir, `contract_${contract._id}.pdf`);
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // **Title**
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("CONTRACT AGREEMENT", { align: "center" })
      .moveDown(1.5);

    // **Contract Details**
    doc.font("Helvetica").fontSize(12);
    doc.text(
      `Contractor: ${contract.contractor} (${contract.contractorEmail})`
    );
    doc.text(`Contractee: ${contract.contracteeEmail}`);
    doc.text(`Start Date: ${contract.startDate.toDateString()}`);
    doc.text(`End Date: ${contract.endDate.toDateString()}`);
    doc.text(`Status: ${contract.status}`);
    doc.moveDown(1);

    // **Dynamic Fields**
    if (Object.keys(contract.dynamicFields).length > 0) {
      doc
        .font("Helvetica-Bold")
        .text("Additional Details:", { underline: true });
      doc.moveDown(0.5);
      doc.font("Helvetica");
      for (const [key, value] of Object.entries(contract.dynamicFields)) {
        doc.text(`${key}: ${value}`);
      }
      doc.moveDown(1);
    }

    // // **Signatures Section**
    // doc
    //   .font("Helvetica-Bold")
    //   .text("Signatures", { underline: true })
    //   .moveDown(0.5);

    // // **Contractor Signature**
    // if (
    //   contract.contractorSignature.digital ||
    //   contract.contractorSignature.photo
    // ) {
    //   doc
    //     .font("Helvetica")
    //     .text(`Contractor: ${contract.contractor}`, { underline: true });

    //   if (contract.contractorSignature.digital) {
    //     const digitalSignaturePath = path.join(
    //       contractsDir,
    //       `contractor_digital_${contract._id}.png`
    //     );
    //     fs.writeFileSync(
    //       digitalSignaturePath,
    //       Buffer.from(
    //         contract.contractorSignature.digital.split(",")[1],
    //         "base64"
    //       )
    //     );
    //     doc.image(digitalSignaturePath, { width: 150 }).moveDown(0.5);
    //   }

    //   if (contract.contractorSignature.photo) {
    //     const photoSignaturePath = path.join(
    //       contractsDir,
    //       `contractor_photo_${contract._id}.png`
    //     );
    //     fs.writeFileSync(
    //       photoSignaturePath,
    //       Buffer.from(
    //         contract.contractorSignature.photo.split(",")[1],
    //         "base64"
    //       )
    //     );
    //     doc.image(photoSignaturePath, { width: 150 }).moveDown(1);
    //   }
    // } else {
    //   doc.text("Contractor Signature: Not signed").moveDown(1);
    // }

    // // **Contractee Signature**
    // if (
    //   contract.contracteeSignature.digital ||
    //   contract.contracteeSignature.photo
    // ) {
    //   doc
    //     .font("Helvetica")
    //     .text(`Contractee: ${contract.contracteeEmail}`, { underline: true });

    //   if (contract.contracteeSignature.digital) {
    //     const digitalSignaturePath = path.join(
    //       contractsDir,
    //       `contractee_digital_${contract._id}.png`
    //     );
    //     fs.writeFileSync(
    //       digitalSignaturePath,
    //       Buffer.from(
    //         contract.contracteeSignature.digital.split(",")[1],
    //         "base64"
    //       )
    //     );
    //     doc.image(digitalSignaturePath, { width: 150 }).moveDown(0.5);
    //   }

    //   if (contract.contracteeSignature.photo) {
    //     const photoSignaturePath = path.join(
    //       contractsDir,
    //       `contractee_photo_${contract._id}.png`
    //     );
    //     fs.writeFileSync(
    //       photoSignaturePath,
    //       Buffer.from(
    //         contract.contracteeSignature.photo.split(",")[1],
    //         "base64"
    //       )
    //     );
    //     doc.image(photoSignaturePath, { width: 150 }).moveDown(1);
    //   }
    // } else {
    //   doc.text("Contractee Signature: Not signed").moveDown(1);
    // }

    // // **Finalize PDF**
    doc.end();

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
};
