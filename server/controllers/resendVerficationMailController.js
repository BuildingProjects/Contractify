const { ContractorUser, ContracteeUser } = require("../models/User");
const { sendVerificationEmail } = require("./sendVerificationMailController");

exports.resendContractorVerificationMail = async (req, res) => {
  // exports.resendContractorVerificationMail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Find user by email
    const user = await ContractorUser.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return res.status(400).json({ error: "Email already verified." });
    }

    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000);
    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      emailVerificationToken
    );
    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: "OTP resent successfully.",
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Failed to send OTP. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).json({
      success: false,
      error: "Server error. Please try again later.",
    });
  }
};

exports.resendContracteeVerificationMail = async (req, res) => {
  const user = await ContracteeUser.findById(req.user.id).select("-password"); // Exclude sensitive data like password

  try {
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }
    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000);

    const email = user.email;
    const emailSent = await sendVerificationEmail(
      email,
      emailVerificationToken
    );
    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: "OTP resent successfully.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};
