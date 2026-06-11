const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
  const { department, name, email, phone, issue, response } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Citizen Request - ${department}`,
      text: `
Department: ${department}
Name: ${name}
Email: ${email}
Phone: ${phone}
Response: ${response}

Issue:
${issue}
      `
    });

    res.status(200).send("Email sent");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error sending email");
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
