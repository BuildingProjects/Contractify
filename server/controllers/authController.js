const { ContractorUser, ContracteeUser } = require("../models/User");
const { generateToken } = require("../utils/jwtHelper");
const bcrypt = require("bcrypt");

// Signup Controller
exports.contractorSignup = async (req, res) => {
  const { name, email, password } = req.body;
    console.log(req.body);
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await ContractorUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new ContractorUser({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.contracteeSignup = async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const existingUser = await ContracteeUser.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
  
      // const hashedPassword = await bcrypt.hash(password, 10);
      const user = new ContracteeUser({ name, email, password });
      await user.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

// Login Controller
exports.contracteeLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await ContracteeUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken({ id: user._id });
    res.status(200).json({ message: "Login successful", token });
    console.log(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.contractorLogin = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const user = await ContractorUser.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
  
      const token = generateToken({ id: user._id });
      res.status(200).json({ message: "Login successful", token });
      console.log(token);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  