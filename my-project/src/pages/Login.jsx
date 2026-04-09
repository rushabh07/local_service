import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {

    let newErrors = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    try {

      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Login failed");
        return;
      }

      alert("Login Successful");

      navigate("/");

    } catch (error) {

      setServerError("Server error. Try again later.");

    }

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">

      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96 border border-white/30">

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Login Page
        </h2>

        {serverError && (
          <p className="text-red-300 text-center mb-3">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/70 focus:outline-none"
              onChange={handleChange}
            />
            <p className="text-red-200 text-sm">{errors.email}</p>
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/70 focus:outline-none"
              onChange={handleChange}
            />
            <p className="text-red-200 text-sm">{errors.password}</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90"
          >
            Login
          </button>

        </form>

        <p className="text-center text-white mt-4 text-sm">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="ml-1 font-semibold cursor-pointer"
          >
            Register
          </span>
        </p>

      </div>

    </div>

  );

}

export default Login;