const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Server is running");
});

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/send", async (req, res) => {
  const { department, name, email, phone, issue, response } = req.body;

  const departmentEmails = {
    "City Manager’s Office": "mayor@threeriversmi.org",
    "Assistant City Manager": "HR@threeriversmi.org",
    "Finance": "BSchoon@threeriversmi.org",
    "Assessor": "chad.apgllc@gmail.com",
    "Building": "athensmi@safebuilt.com",
    "Code Enforcement": "JBeebe@threeriversmi.org",
    "Clerk": "LWilson@threeriversmi.org",
    "Utilities": "WaterBilling@threeriversmi.org",
    "Fire": "PaulS@threeriversmi.org",
    "Police": "SBoling@threeriversmi.org",
    "DPS": "ARoth@threeriversmi.org"
  };

  const recipient =
    departmentEmails[department] || process.env.EMAIL_TO;

  const msg = {
    to: recipient,
    from: process.env.EMAIL_TO,
    replyTo: email,
    subject: `Citizen Request - ${department}`,
    text: `
Department: ${department}
Name: ${name}
Email: ${email}
Phone: ${phone}
Preferred Response: ${response}

Issue:
${issue}
    `
  };

  try {
    await sgMail.send(msg);

    res.status(200).json({
      success: true,
      message: "Email sent"
    });
    } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
