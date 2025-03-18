const nodemailer = require('nodemailer');

// Setup nodemailer transporter with SMTP settings for Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'contractify2025@gmail.com',
    pass: 'bdmo ukbw lytz izmx'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify SMTP connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

const sendContractEmails = async (contract) => {
  const contractUrl = `${process.env.BASE_URL}/contracts/${contract._id}`;
  
  // Send email to contractor
  await transporter.sendMail({
    from: '"Contractify" <contractify2025@gmail.com>',
    to: contract.contractorEmail,
    subject: 'New Contract Created',
    html: `
      <h1>New Contract Created</h1>
      <p>A new contract has been created between you and ${contract.contracteeEmail}.</p>
      <p>Contract Details:</p>
      <ul>
        <li>Category: ${contract.contractCategory}</li>
        <li>Description: ${contract.contractDescription}</li>
        <li>Value: ${contract.contractValue}</li>
        <li>Start Date: ${contract.startDate}</li>
        <li>End Date: ${contract.endDate}</li>
      </ul>
      <p>View contract at: <a href="${contractUrl}">${contractUrl}</a></p>
    `
  });

  // Send email to contractee
  await transporter.sendMail({
    from: '"Contractify" <contractify2025@gmail.com>',
    to: contract.contracteeEmail,
    subject: 'New Contract for Review',
    html: `
      <h1>New Contract for Review</h1>
      <p>A new contract has been created by ${contract.contractorEmail}.</p>
      <p>Contract Details:</p>
      <ul>
        <li>Category: ${contract.contractCategory}</li>
        <li>Description: ${contract.contractDescription}</li>
        <li>Value: ${contract.contractValue}</li>
        <li>Start Date: ${contract.startDate}</li>
        <li>End Date: ${contract.endDate}</li>
      </ul>
      <p>View and sign the contract at: <a href="${contractUrl}">${contractUrl}</a></p>
    `
  });
};

module.exports = {
  sendContractEmails,
  transporter
}; 