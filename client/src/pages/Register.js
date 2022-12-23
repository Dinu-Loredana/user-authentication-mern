import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  password: "",
};

function Register() {
  const [values, setValues] = useState(initialState);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:1333/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
      const data = await response.json();

      if (response.status === 201) {
        setUser(data);
        navigate("/login");
      } else {
        console.log("error data", data);
        setErr(data.msg);
      }
      setUser(initialState);
    } catch (error) {
      console.log("error from client", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (err) {
        setErr(null);
      }
    }, 3000);
  }, [err]);

  return (
    <div>
      <h1>Register</h1>
      {err && <h4>{err}</h4>}
      <form onSubmit={registerUser}>
        <input
          type="text"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
        />
        <br></br>
        <input
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
        />
        <br></br>
        <input
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
        />
        <br></br>
        <button type="submit" disabled={err}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
