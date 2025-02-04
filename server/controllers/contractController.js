const Contract = require("../models/Contract");

const createContract = async (req, res) => {
  try {
    const { contractor, startDate, endDate, ...dynamicFields } = req.body;

    const newContract = new Contract({
      contractor,
      startDate,
      endDate,
      dynamicFields,
    });

    await newContract.save();
    res
      .status(201)
      .json({ message: "Contract created succesfully", contract: newContract });
  } catch (error) {
    console.error("Error creating contract:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { createContract };
