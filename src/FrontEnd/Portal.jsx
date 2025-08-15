import React, { useEffect, useState } from "react";
import "./Portal.css";
import EmployeeDetails from "./EmployeeDetails";

function Portal() {
  const [country, setCountry] = useState([]);         // [{code, name}]
  const [nationality, setNationality] = useState(""); // selected value
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((r) => r.json())
      .then((data) => {
        const list = data
          .map((c) => ({ code: c.cca2, name: c.name.common }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountry(list);
      })
      .catch(console.error);
  }, []);

  const handleClick = ()=> setOpen(o => !o); 

  return (
    <>
      <h1 className="heading">Job Application Portal</h1>

      <div className="body1">
        <p><b><u>Job Title:</u></b></p>
        <h2>FrontEnd Developer</h2>
      </div>

      <div className="box">
        <div className="body2">
          <p><b><u>Personal details:</u></b></p>

          <label htmlFor="name">Name:</label>
          <input id="name" type="text" />

          <label htmlFor="vorname">Vorname:</label>
          <input id="vorname" type="text" />

          <div className="body2">
            <label htmlFor="dob">Date Of Birth:</label>
            <input id="dob" type="date" />

            <label htmlFor="nationality">Nationality:</label>
            <select
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            >
              <option value="">Select a country</option>
              {country.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="body2">
            <label htmlFor="phone">Phone:</label>
            <input id="phone" type="text" />

            <label htmlFor="email">Email:</label>
            <input type="text" />
            </div>  
           
          </div>
        </div>

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
            <div id="popup1" className={`popup right ${open ? "show" : ""}`}>type popup</div>
           </div>
        </div>
        

        
        <button className="btnS">Submit</button>
       
      </div>
    </>
  );
}

export default Portal;
