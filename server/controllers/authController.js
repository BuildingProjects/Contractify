const { ContractorUser, ContracteeUser } = require("../models/User");
const { generateToken } = require("../utils/jwtHelper");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");


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

    // Create a random 6-digit verification code
    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000);

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new ContractorUser({
      name,
      email,
      password,
      emailVerificationToken,
    });
    await user.save();

    await sendVerificationEmail(email, emailVerificationToken);

    const token = generateToken({ id: user._id });
    res
      .cookie("authToken", token, {
        httpOnly: true, // Ensures the cookie is sent only in HTTP(S) requests
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      })
      .status(201)
      .json({
        message: "User registered successfully, please verify your email",
      });
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

    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000);

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new ContracteeUser({ name, email, password });
    await user.save();

    await sendVerificationEmail(email, emailVerificationToken);

    const token = generateToken({ id: user._id });
    res
      .cookie("authToken", token, {
        httpOnly: true, // Ensures the cookie is sent only in HTTP(S) requests
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      })
      .status(201)
      .json({
        message: "User registered successfully, please verify your email",
      });
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
    res
      .cookie("authToken", token, {
        httpOnly: true, // Ensures the cookie is sent only in HTTP(S) requests
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      })
      .status(200)
      .json({ message: "Login successful", token });
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
    res
      .cookie("authToken", token, {
        httpOnly: true, // Ensures the cookie is sent only in HTTP(S) requests
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      })
      .status(200)
      .json({ message: "Login successful", token });
    console.log(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//send verification email
const sendVerificationEmail = async (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your Email Verification Code",
    html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <b>${verificationCode}</b></p>
        <p>Please enter this code to verify your email address.</p>
      `,
  };

  await transporter.sendMail(mailOptions);
};
