import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const populateData = async () => {
    const req = await fetch("http://localhost:1333/api/quote", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const quote = req.json();
    console.log("quote", quote);
  };
  useEffect(() => {
    //get the token from local storage
    const token = localStorage.getItem("token");
    // check the token with decoded valie
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        // if user exists populate the data
        populateData();
      }
    }
  }, [navigate]);
  return <div>Dashboard</div>;
}

export default Dashboard;
