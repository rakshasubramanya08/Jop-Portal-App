import React, { useState, useEffect } from "react";
import "./Portal.css";

export default function Portal() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Fetch countries list once
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sorted);
      })
      .catch((err) => console.error("Country fetch error:", err));
  }, []);

  const handleClick = () => setOpen((o) => !o);

  async function submitApplication(e) {
    e.preventDefault();
    setSubmitting(true);
    setPreview("");

    const fd = new FormData(e.target);

    for (const [k, v] of fd.entries()) {
      console.log("FD:", k, v instanceof File ? v.name : v);
    }

    try {
      const res = await fetch("http://localhost:4000/api/apply", {
        method: "POST",
        body: fd
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned non-JSON:\n" + text);
      }

      if (!res.ok) throw new Error(data.error || "Submit failed");

      setPreview(data.preview || "");
      alert("Submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="heading">Job Application Portal</h1>

      <form className="box" onSubmit={submitApplication}>
        <div className="body1">
          <p>
            <b>
              <u>Job Title:</u>
            </b>
          </p>
          <h2>FrontEnd Developer</h2>
        </div>

        {/* Personal Details */}
        <div>
          <label>
            Name:
            <input type="text" name="name" required />
          </label>

          <label>
            Email:
            <input type="email" name="email" required />
          </label>

          <label>
            Phone:
            <input type="text" name="phone" />
          </label>

          <label>
            Date of Birth:
            <input type="date" name="dob" />
          </label>

          <label>
            Nationality:
            <select name="nationality" required>
              <option value="">-- Select Nationality --</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Address */}
        <div className="body3">
          <p>
            <b>
              <u>Address:</u>
            </b>
          </p>

          <label htmlFor="street">Street:</label>
          <input id="street" name="street" type="text" />

          <label htmlFor="city">City:</label>
          <input id="city" name="city" type="text" />

          <div className="body3">
            <label htmlFor="zip">Postal code:</label>
            <input id="zip" name="zip" type="text" />
          </div>
        </div>

        {/* Employment Info */}
        <div>
          <label>
            Salary Expectations:
            <input
              id="salaryExpectations"
              name="salaryExpectations"
              type="number"
              placeholder="e.g., 65000"
              min="0"
            />
          </label>

          <label>
            Earliest Joining Date:
            <input
              id="earliestJoiningDate"
              name="earliestJoiningDate"
              type="date"
            />
          </label>

          <label>
            Cover Letter:
            <textarea id="coverLetterText" name="coverLetterText" />
          </label>
        </div>

        {/* File Uploads */}
        <div className="upload">
          <p>
            <b>
              <u>Documents Upload:</u>
            </b>
          </p>

          <label htmlFor="cv">Resume:</label>
          <input id="cv" type="file" name="cv" />

          <label htmlFor="coverLetterFile">Cover Letter:</label>
          <input id="coverLetterFile" type="file" name="coverLetterFile" />

          <label htmlFor="otherdocs">Other Documents:</label>
          <input id="otherdocs" type="file" name="otherdocs" multiple />
        </div>

        {/* Terms */}
        <div>
          <div className="lastBox">
            <input type="checkbox" name="terms" required />
            <label htmlFor="term">
              By clicking here you are accepting terms and conditions.
            </label>
            <button
              type="button"
              className="info"
              aria-expanded={open}
              aria-controls="popup1"
              onClick={handleClick}
            >
              ℹ️
            </button>
            <div id="popup1" className={`popup right ${open ? "show" : ""}`}>
              Terms and Conditions for Processing Personal Data and Documents By
              submitting your application through this portal, you acknowledge
              and agree to the following terms regarding the processing of your
              personal data and documents: Collection of Data We collect
              personal information that you voluntarily provide when applying
              for a position, including but not limited to your name, contact
              details, CV/resume, cover letter, educational qualifications,
              employment history, and any other supporting documents. Purpose of
              Processing Your data will be processed solely for
              recruitment-related purposes, including evaluating your
              application, assessing your suitability for the role, contacting
              you regarding your application, and maintaining records required
              for recruitment processes. Data Sharing Your information may be
              shared with authorized employees, hiring managers, and
              decision-makers involved in the recruitment process. We will not
              disclose your data to third parties for marketing or unrelated
              purposes without your explicit consent, except where required by
              law. Data Storage & Retention All submitted personal data and
              documents will be stored securely. If your application is
              unsuccessful, your data may be retained for a limited period
              (e.g., 6–12 months) for future recruitment opportunities, unless
              you request its deletion earlier. Data Security We implement
              reasonable technical and organizational measures to protect your
              personal data from unauthorized access, loss, or misuse. Applicant
              Rights You have the right to request access to your personal data,
              request correction of inaccuracies, or request deletion of your
              data in accordance with applicable data protection laws (e.g.,
              GDPR if applying within the EU). To exercise these rights, please
              contact us at [insert contact email]. Consent By submitting your
              application, you consent to the collection, processing, and
              retention of your personal data and documents in accordance with
              these terms.
            </div>
          </div>
        </div>

        <button className="btnS" type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </form>

      {preview && (
        <p style={{ marginTop: 12 }}>
          Preview email:{" "}
          <a href={preview} target="_blank" rel="noreferrer">
            {preview}
          </a>
        </p>
      )}
    </>
  );
}
