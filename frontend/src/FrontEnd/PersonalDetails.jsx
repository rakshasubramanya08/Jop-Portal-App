import React from 'react'
import { useEffect, useState, useMemo} from 'react';
import './PersonalDetails.css';

const PersonalDetails = () => {

    const [country, setCountry] = useState([]);         // [{code, name}]
    const [nationality, setNationality] = useState(""); // selected value
    const [date, setDate] = useState("");

    const minDate = "1980-01-01";
   const maxDate = useMemo(() => {
    const y = new Date().getFullYear() - 1;   // last year
    return `${y}-12-31`;
  }, []);

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

  return (
    <div>
           <div className="body2">
          <p><b><u>Personal details:</u></b></p>

          <label htmlFor="name">Name:</label>
          <input id="name" type="text" />

          <label htmlFor="vorname">Vorname:</label>
          <input id="vorname" type="text" />

          <div className="body2">
            <label htmlFor="dob">Date Of Birth:</label>
            <input id="dob" type="date" 
                            min={minDate}  max={maxDate} 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required />

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
      
    </div>
  )
}

export default PersonalDetails
