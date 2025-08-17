require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

const app = express();

// CORS
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

// Rate limit
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 60
  })
);

// Multer: accept ANY field names + files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB per file
});

// Create Ethereal test transporter on startup
let transporter;
(async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log("Ethereal test account created:");
  console.log("  User:", testAccount.user);
  console.log("  Pass:", testAccount.pass);

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });
})();

// Utility: safe HTML
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Build HTML table from all text fields
function renderHTMLFromBody(body) {
  const rows = Object.entries(body).map(
    ([k, v]) =>
      `<tr><td style="padding:6px 10px;border:1px solid #ddd;"><b>${esc(
        k
      )}</b></td><td style="padding:6px 10px;border:1px solid #ddd;">${esc(
        v
      )}</td></tr>`
  );
  return `
    <div style="font-family:system-ui,Segoe UI,Arial;color:#111">
      <h2 style="margin:0 0 8px 0;">New Job Application</h2>
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse">
        ${rows.join("")}
      </table>
      <p style="margin-top:14px;color:#444;">Attached: uploaded documents.</p>
    </div>
  `;
}

// Find first email-looking value among fields for replyTo
function findReplyTo(body) {
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  for (const [, v] of Object.entries(body)) {
    if (typeof v === "string" && emailRegex.test(v)) {
      const match = v.match(emailRegex);
      if (match) return match[0];
    }
  }
  return undefined;
}

// Simple health
app.get("/health", (_, res) => res.json({ ok: true }));

// Optional echo for debugging
app.post("/debug/echo", upload.any(), (req, res) => {
  res.json({
    fields: req.body,
    files: (req.files || []).map((f) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size
    }))
  });
});

// Main endpoint (accepts any fields + files)
app.post("/api/apply", upload.any(), async (req, res) => {
  try {
    if (!transporter) {
      return res
        .status(503)
        .json({ ok: false, error: "Mailer not ready. Try again in a second." });
    }

    const fields = req.body || {};
    const attachments = (req.files || []).map((f) => ({
      filename: f.originalname || f.fieldname,
      content: f.buffer,
      contentType: f.mimetype
    }));

    const subjectHint =
      fields.name ||
      fields.fullname ||
      fields.full_name ||
      fields.candidateName ||
      fields.applicant ||
      "Applicant";

    const info = await transporter.sendMail({
      from: '"Job Portal" <no-reply@example.com>',
      to: "hr@example.com", // with Ethereal, any address is fine
      subject: `Job Application: ${subjectHint}`,
      text:
        "A new application was submitted.\n\n" +
        Object.entries(fields)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n"),
      html: renderHTMLFromBody(fields),
      attachments,
      ...(findReplyTo(fields) ? { replyTo: findReplyTo(fields) } : {})
    });

    const preview = nodemailer.getTestMessageUrl(info);
    console.log("Message sent:", info.messageId);
    console.log("Preview URL:", preview);

    res.json({ ok: true, message: "Application submitted", preview });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ ok: false, error: "Email failed", details: err.message });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`API listening on :${port}`));
