import React, { useEffect, useState } from "react";
// import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tempQuote, setTempQuote] = useState("");
  const [quote, setQuote] = useState("");
  const navigate = useNavigate();

  const saveQuoteHandler = async (e) => {
    e.preventDefault();
    const req = await fetch("http://localhost:1333/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: tempQuote,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      setQuote(tempQuote);
      setTempQuote("");
    } else {
      alert(data.error);
    }
  };

  const populateData = async () => {
    const req = await fetch("http://localhost:1333/api/quote", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    console.log("req", req);
    console.log("data", data);

    if (data.status === "ok") {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  };

  useEffect(() => {
    // verify if the user is logedin, get the token from local storage
    const token = localStorage.getItem("token");
    // decode token
    if (token) {
      const user = jwt_decode(token);
      // const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        // if user exists populate the data
        populateData();
      }
    }
  }, [navigate]);

  return (
    <div>
      <form onSubmit={saveQuoteHandler}>
        <input
          type="text"
          placeholder="your favorite quote"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        />
        <input type="submit" value="Save" />
      </form>
      <p>Your quote: {quote || "No quote found. Add a quote."}</p>
    </div>
  );
}

export default Dashboard;
