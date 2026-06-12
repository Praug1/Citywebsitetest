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

  console.log("Form received:", req.body);

  const msg = {
    to: process.env.EMAIL_TO,
    from: process.env.EMAIL_TO, // must match verified sender
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

    console.log("Email sent successfully");

    res.status(200).json({
      success: true,
      message: "Email sent"
    });

  } catch (err) {
    console.error("SendGrid Error:", err.response?.body || err);

    res.status(500).json({
      success: false,
      error: "Email failed"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
