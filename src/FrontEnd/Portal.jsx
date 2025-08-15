import React from 'react'
import './Portal.css';


function Portal() {
  return (
    <>
     <h1>Job Application Portal</h1> 

     <div className="body1">
        <label htmlFor='jobTitle'>Job Title</label>
        <input type="text" />
     </div>

     <div className="body2">
        <label htmlFor="name">Name:</label>  
        <input type="text" />

        <label htmlFor='Vorname:'>Vorname:</label>
        <input type="text" />

        <label htmlFor="DOB">Date Of Birth:</label>
        <input type="datetime-local" />

        <label htmlFor="Nationality">Nationality:</label>
        <input type="text" />
     </div>

     <div className="body3">
        <p>Address</p>
        <label htmlFor="street">Street:</label>
        <input type="text" />

        <label htmlFor="city">City:</label>
        <input type="text" />

        <label htmlFor="Zip">Zip:</label>
        <input type="text" />

        <label htmlFor="Phone">Phone</label>
        <input type="text" />
     </div>
    </>
  )
}

export default Portal
