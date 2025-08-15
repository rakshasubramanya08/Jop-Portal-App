import React from 'react'
import { useMemo, useState } from "react";
import './EmployeeDetails.css';

const EmployeeDetails = () => {

  const [joindate, setJoinDate] = useState("");

  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  
  return (
    <div>
          <div className="empdet">
          <p><b><u>Employement Details:</u></b></p>
           <label htmlFor="early">Earliest joining date:</label>
            <input type="date"
                    min={todayStr}            
                    value={joindate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    required />

            <label htmlFor="salary">Salary Expectation:</label>
            <input type="number" />            
        </div>
      
    </div>
  )
}

export default EmployeeDetails
