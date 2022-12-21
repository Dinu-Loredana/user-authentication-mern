import React, { useEffect, useState } from "react";
// import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [quote, setQuote] = useState("");
  const [quotes, setQuotes] = useState([]);
  const navigate = useNavigate();

  const quoteHandler = async (e) => {
    e.preventDefault();
    const req = await fetch("http://localhost:1333/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      alert("Quote added.");
      setQuote("");
    } else {
      alert(data.error);
    }
  };

  const getQuotes = async () => {
    const req = await fetch("http://localhost:1333/api/quote", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      setQuotes(data.quotes);
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
        getQuotes();
      }
    }
  }, [navigate, quote]);

  return (
    <div>
      <form onSubmit={quoteHandler}>
        <input
          type="text"
          placeholder="your favorite quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
        <br />
        <input type="submit" value="Save" />
      </form>
      <h5>Your quotes:</h5>
      <ul>
        {quotes &&
          quotes.length > 0 &&
          quotes.map((q, i) => <li key={i}>{q}</li>)}
      </ul>
      {quotes.length === 0 && <p>No quote found. Add a quote.</p>}
    </div>
  );
}

export default Dashboard;
