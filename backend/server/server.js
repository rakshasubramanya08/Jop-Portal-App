require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 60_000,
  max: 30,
});
app.use(limiter);

// File upload setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Validation schema
const ApplySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  position: z.string().optional(),
  experienceYears: z.string().optional(),
  coverLetterText: z.string().optional(),
});

// --- Nodemailer transporter (Ethereal) ---
let transporter;
(async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log("Ethereal test account created:");
  console.log("  User:", testAccount.user);
  console.log("  Pass:", testAccount.pass);

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure, // true for 465, false for 587
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
})();

// Helper: render email HTML
function renderHTML(data) {
  return `
    <div style="font-family:system-ui,Segoe UI,Arial;">
      <h2>New Job Application</h2>
      <table cellspacing="0" cellpadding="6" style="border-collapse:collapse">
        <tr><td><b>Name</b></td><td>${data.name}</td></tr>
        <tr><td><b>Email</b></td><td>${data.email}</td></tr>
        ${data.phone ? `<tr><td><b>Phone</b></td><td>${data.phone}</td></tr>` : ""}
        ${data.position ? `<tr><td><b>Position</b></td><td>${data.position}</td></tr>` : ""}
        ${data.experienceYears ? `<tr><td><b>Experience</b></td><td>${data.experienceYears} years</td></tr>` : ""}
      </table>
      ${data.coverLetterText ? `<h3 style="margin-top:16px;">Cover Letter</h3><pre style="white-space:pre-wrap">${data.coverLetterText}</pre>` : ""}
    </div>
  `;
}

// Helper: collect file attachments
function filesToAttachments(req, fieldNames) {
  const attachments = [];
  fieldNames.forEach((name) => {
    (req.files?.[name] || []).forEach((f) => {
      attachments.push({
        filename: f.originalname,
        content: f.buffer,
        contentType: f.mimetype,
      });
    });
  });
  return attachments;
}

// Health check
app.get("/health", (_, res) => res.json({ ok: true }));

// Main route
app.post(
  "/api/apply",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "coverLetterFile", maxCount: 1 },
    { name: "otherdocs", maxCount: 5 }, // allow up to 5 other files
  ]),
  async (req, res) => {
    try {
      const parsed = ApplySchema.parse(req.body);
      const attachments = filesToAttachments(req, [
        "cv",
        "coverLetterFile",
        "otherdocs",
      ]);

      if (!transporter) {
        return res.status(500).json({ ok: false, error: "Mailer not ready yet" });
      }

      // Send email (to Ethereal)
      const info = await transporter.sendMail({
        from: '"Job Portal" <no-reply@example.com>',
        to: "hr@example.com", // doesn’t matter with Ethereal
        subject: `Job Application: ${parsed.name}`,
        text: `Application from ${parsed.name} (${parsed.email})`,
        html: renderHTML(parsed),
        attachments,
        replyTo: parsed.email,
      });

      console.log("Message sent:", info.messageId);
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

      res.json({ ok: true, message: "Application submitted", preview: nodemailer.getTestMessageUrl(info) });
    } catch (err) {
      console.error("Server error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ ok: false, error: "Invalid input", details: err.flatten() });
      }
      res.status(500).json({ ok: false, error: "Email failed", details: err.message });
    }
  }
);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});
