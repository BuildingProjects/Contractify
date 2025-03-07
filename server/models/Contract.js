const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema({
  contractor: { type: String, required: true },
  contractorEmail: { type: String, required: true },
  contracteeEmail: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: [
      "Pending",
      "Accepted",
      "Rejected",
      "Signed by Contractor",
      "Signed by Contractee",
      "Signed by Both",
      "Ongoing",
        "Expired"
    ],
    default: "Pending",
  },
  signedBy: { type: Array, default: [] }, // Stores who has signed (contractor, contractee)
  contractorSignature: {
    digital: { type: String, default: "" }, // Store base64 digital signature
    photo: { type: String, default: "" }, // Store URL or base64 of photo signature
  },
  contracteeSignature: {
    digital: { type: String, default: "" },
    photo: { type: String, default: "" },
  },
  dynamicFields: { type: Object, default: {} }, // Stores variable fields
});

module.exports = mongoose.model("Contract", ContractSchema);
