import React, { useState } from "react";
import "./Portal.css";
import EmployeeDetails from "./EmployeeDetails";
import PersonalDetails from "./PersonalDetails";

function Portal() {
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen((o) => !o);

  async function submitApplication(e) {
    e.preventDefault(); // stop page reload

    const fd = new FormData(e.target); // grab all inputs by their name attribute

    // Debug: log everything you’re sending
    for (const [k, v] of fd.entries()) {
      console.log("FD:", k, v instanceof File ? v.name : v);
    }

    const res = await fetch("http://localhost:4000/api/apply", {
      method: "POST",
      body: fd, // don't set headers manually
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Submit failed");
    alert("Submitted successfully!");
  }

  return (
    <>
      <h1 className="heading">Job Application Portal</h1>

      <form className="box" onSubmit={submitApplication}>
        {/* <PersonalDetails />
        <EmployeeDetails /> */}

        {/* Example basic fields */}
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
          Position:
          <input type="text" name="position" />
        </label>
        <label>
          Experience (years):
          <input type="number" name="experienceYears" />
        </label>
        <label>
          Cover Letter:
          <textarea name="coverLetterText" />
        </label>

        {/* File inputs must have the exact names expected by backend */}
        <div className="upload">
          <p>
            <b>
              <u>Documents Upload:</u>
            </b>
          </p>
          <label>Resume:</label>
          <input type="file" name="cv" />

          <label>Cover Letter:</label>
          <input type="file" name="coverLetterFile" />

          <label>Other Documents:</label>
          <input type="file" name="otherdocs" />
        </div>

        <div className="lastBox">
          <input type="checkbox" name="terms" required />
          <label htmlFor="terms">
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
            {/* terms text… */}
          </div>
        </div>

        <button className="btnS" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default Portal;
