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
    "City Manager’s Office": "jonahwest77@gmail.com",
    "Assistant City Manager": "jagycoslpoer@gmail.com",
    "Finance": "mmarionweismuller@gmail.com",
    "Assessor": "assessor@yourcity.org",
    "Building": "building@yourcity.org",
    "Code Enforcement": "code@yourcity.org",
    "Clerk": "clerk@yourcity.org",
    "Utilities": "utilities@yourcity.org",
    "Fire": "fire@yourcity.org",
    "Police": "police@yourcity.org",
    "DPS": "dps@yourcity.org"
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
