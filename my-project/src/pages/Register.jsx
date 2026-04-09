import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
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

    if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (formData.address.trim().length < 5) {
      newErrors.address = "Enter a valid address";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    try {

      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Registration failed");
        return;
      }

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {

      setServerError("Server error. Try again later.");

    }

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <button
  onClick={() => navigate("/")}
  className="absolute top-6 left-6 flex items-center gap-2 px-5 py-2 
  text-white font-semibold bg-white/20 backdrop-blur-md 
  border border-white/30 rounded-lg shadow-md 
  hover:bg-white/30 transition duration-300"
>
  ← Home
</button>
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96 border border-white/30">
      
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Account
        </h2>

        {serverError && (
          <p className="text-red-200 text-center mb-3">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 rounded-lg bg-white/70 focus:outline-none"
              onChange={handleChange}
            />
            <p className="text-red-200 text-sm">{errors.name}</p>
          </div>

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

          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full p-3 rounded-lg bg-white/70 focus:outline-none"
              onChange={handleChange}
            />
            <p className="text-red-200 text-sm">{errors.phone}</p>
          </div>

          <div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="w-full p-3 rounded-lg bg-white/70 focus:outline-none"
              onChange={handleChange}
            />
            <p className="text-red-200 text-sm">{errors.address}</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90"
          >
            Register
          </button>
          

        </form>

        <p className="text-center text-white mt-4 text-sm">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="ml-1 font-semibold cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>

    </div>

  );

}

export default Register;