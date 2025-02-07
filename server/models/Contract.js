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
      "Acccepted",
      "Rejected",
      "Signed by Contractor",
      "Signed by Contractee",
      "Signed by Both",
      "Ongoing",
    ],
    default: "Pending",
  },
  signedBy: { type: Array, default: [] }, // Stores who has signed (contractor, contractee)
  dynamicFields: { type: Object, default: {} }, // Stores variable fields
});

module.exports = mongoose.model("Contract", ContractSchema);
