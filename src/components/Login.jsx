import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AUTH0_CODE_CHALLENGE_METHOD, AUTH0_LOGIN_RESPONSE_TYPE, AUTH0_REALM } from '../config';
import { auth } from '../services/auth0.service';
var CryptoJS = require("crypto-js");

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const userId = sessionStorage.getItem("authUserId");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    const email = formData?.email.toLowerCase();
    setLoading(true);
    if (formData) {
      function base64URLEncode(str) {
        return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      }
      function dec2hex(dec) {
        return dec.toString(16).padStart(2, "0");
      }
      function generateId(len) {
        var arr = new Uint8Array((len || 40) / 2);
        window.crypto.getRandomValues(arr);
        return Array.from(arr, dec2hex).join("");
      }
      var verifier = generateId(50);

      let basecodeChallenge = CryptoJS.SHA256(verifier).toString(
        CryptoJS.enc.Base64
      );
      basecodeChallenge = base64URLEncode(basecodeChallenge);
      sessionStorage.setItem("verifier", verifier);
               auth.login(
              {
                username: email,
                password: formData?.password,
                redirectUri: process.env.REACT_APP_AUTH0_LOGIN_REDIRECT_URL,
                realm: AUTH0_REALM,
                responseType: AUTH0_LOGIN_RESPONSE_TYPE,
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                code_challenge: basecodeChallenge,
                code_challenge_method: AUTH0_CODE_CHALLENGE_METHOD,
              },

              (error, result) => {
                if (error) {
                  toast.error(
                    "Login failed; Invalid user ID or password.",
                    {
                      autoClose: 3000,
                    }
                  );
                  setLoading(false);
                  return;
                }
                toast.success("User logged in successfully", {
                  autoClose: 3000,
                });
                setLoading(false);
              }
            );
  }
}
  const handleRegister = () => {
    navigate("/register");
  }

  useEffect(() => {
    if (userId) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div className="login-form-container">
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

      <button type="submit">Login</button>
      <br />
      <br />
      <div>
      <button type="button" onClick={handleRegister}>Register</button>
      </div>

    </form>
  </div>
  )
}

export default Login