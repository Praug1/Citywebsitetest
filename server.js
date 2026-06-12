const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/send", async (req, res) => {
  console.log("REQUEST RECEIVED:", req.body);

  try {
    res.status(200).json({
      success: true,
      message: "Server received form (email temporarily disabled)"
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

    console.log("Testing SMTP connection...");

    await transporter.verify();

    console.log("SMTP connection successful.");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,
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
    });

    console.log("Email sent successfully.");

    res.status(200).json({
      success: true,
      message: "Email sent"
    });

  } catch (err) {
    console.error("EMAIL ERROR:");
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
