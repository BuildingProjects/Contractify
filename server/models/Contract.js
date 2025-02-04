const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema({
  contractor: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  dynamicFields: { type: Object, default: {} }, // Stores variable fields
});

module.exports = mongoose.model("Contract", ContractSchema);
