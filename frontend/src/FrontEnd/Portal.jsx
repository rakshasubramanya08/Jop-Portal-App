import React, { useEffect, useState } from "react";
import "./Portal.css";
import EmployeeDetails from "./EmployeeDetails";
import PersonalDetails from "./PersonalDetails";

function Portal() {
  
  const [open, setOpen] = useState(false);

  const handleClick = ()=> setOpen(o => !o); 

  return (
    <>
      <h1 className="heading">Job Application Portal</h1>

      <div className="body1">
        <p><b><u>Job Title:</u></b></p>
        <h2>FrontEnd Developer</h2>
      </div>

      <div className="box">
        <PersonalDetails />

        <div className="body3">
          <p><b><u>Address:</u></b></p>

          <label htmlFor="street">Street:</label>
          <input id="street" type="text" />

          <label htmlFor="city">City:</label>
          <input id="city" type="text" />

          <div className="body3">
            <label htmlFor="zip">Postal code:</label>
            <input id="zip" type="text" />
          </div>
        </div>

        <EmployeeDetails />
        
        <div className="upload">
          <p><b><u>Documents Upload:</u></b></p>
           <label htmlFor="resume">Resume:</label>
            <input type="file" />

            <label htmlFor="coverle">Cover Letter:</label>
            <input type="file" />  

            <label htmlFor="otherdocs">Other Documents:</label>
            <input type="file" />  
        </div>

        <div>
            <div className="lastBox">
            <input type="checkbox" /><label htmlFor="term">By clicking here you are accepting terms and conditions.</label>
            <button  type="button"
                     className="info"
                     aria-expanded={open}
                     aria-controls="popup1"
                     onClick={handleClick}>
            ℹ️
            </button>
            <div id="popup1" className={`popup right ${open ? "show" : ""}`}>
              Terms and Conditions for Processing Personal Data and Documents

By submitting your application through this portal, you acknowledge and agree to the following terms regarding the processing of your personal data and documents:

Collection of Data

We collect personal information that you voluntarily provide when applying for a position, including but not limited to your name, contact details, CV/resume, cover letter, educational qualifications, employment history, and any other supporting documents.

Purpose of Processing

Your data will be processed solely for recruitment-related purposes, including evaluating your application, assessing your suitability for the role, contacting you regarding your application, and maintaining records required for recruitment processes.

Data Sharing

Your information may be shared with authorized employees, hiring managers, and decision-makers involved in the recruitment process.

We will not disclose your data to third parties for marketing or unrelated purposes without your explicit consent, except where required by law.

Data Storage & Retention

All submitted personal data and documents will be stored securely.

If your application is unsuccessful, your data may be retained for a limited period (e.g., 6–12 months) for future recruitment opportunities, unless you request its deletion earlier.

Data Security

We implement reasonable technical and organizational measures to protect your personal data from unauthorized access, loss, or misuse.

Applicant Rights

You have the right to request access to your personal data, request correction of inaccuracies, or request deletion of your data in accordance with applicable data protection laws (e.g., GDPR if applying within the EU).

To exercise these rights, please contact us at [insert contact email].

Consent

By submitting your application, you consent to the collection, processing, and retention of your personal data and documents in accordance with these terms.
            </div>
           </div>
        </div>
        

        
        <button className="btnS">Submit</button>
       
      </div>
    </>
  );
}

export default Portal;
