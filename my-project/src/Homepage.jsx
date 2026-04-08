import React from "react";
import { FaTools, FaUserPlus, FaUserCheck, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Homepage() {

const navigate = useNavigate();

  return (
    <div className="font-sans ">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-md">

        <h1 className="text-2xl font-bold text-blue-600">
           Smart LocalServices
        </h1>

        <ul className="hidden md:flex gap-6 font-medium">
          <li className="cursor-pointer hover:text-blue-600">Home</li>
          <li className="cursor-pointer hover:text-blue-600">Services</li>
          <li className="cursor-pointer hover:text-blue-600">Providers</li>
          <li className="cursor-pointer hover:text-blue-600">Contact</li>
        </ul>

        <div className="flex gap-3">

          <button
          onClick={()=>navigate("/login")}
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
            Login
          </button>

          <button
          onClick={()=>navigate("/register")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <FaUserPlus />
            Register
          </button>

        </div>

      </nav>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-24 px-6">

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Book Trusted Local Services
        </h1>

        <p className="mb-6 text-lg">
          Electricians, plumbers, cleaners and more at your doorstep
        </p>

        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
          Book Service
        </button>

      </section>

      {/* Services Section */}
      <section className="py-16 px-10">

        <h2 className="text-3xl font-bold text-center mb-10">
          Popular Services
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">

          <div className="p-6 shadow-lg rounded-xl text-center hover:shadow-xl">
            <FaTools className="text-4xl mx-auto text-blue-600 mb-4"/>
            <h3 className="font-bold">Electrician</h3>
          </div>

          <div className="p-6 shadow-lg rounded-xl text-center hover:shadow-xl">
            <FaTools className="text-4xl mx-auto text-blue-600 mb-4"/>
            <h3 className="font-bold">Plumber</h3>
          </div>

          <div className="p-6 shadow-lg rounded-xl text-center hover:shadow-xl">
            <FaTools className="text-4xl mx-auto text-blue-600 mb-4"/>
            <h3 className="font-bold">Cleaning</h3>
          </div>

          <div className="p-6 shadow-lg rounded-xl text-center hover:shadow-xl">
            <FaTools className="text-4xl mx-auto text-blue-600 mb-4"/>
            <h3 className="font-bold">AC Repair</h3>
          </div>

        </div>

      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-16 px-10">

        <h2 className="text-3xl font-bold text-center mb-10">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">

          <div>
            <FaUserCheck className="text-4xl mx-auto text-blue-600 mb-4"/>
            <h3 className="font-bold text-xl">Search Service</h3>
            <p className="text-gray-600">
              Find nearby professionals easily
            </p>
          </div>

          <div>
            <FaTools className="text-4xl mx-auto text-blue-600 mb-4"/>
            <h3 className="font-bold text-xl">Book Instantly</h3>
            <p className="text-gray-600">
              Schedule service quickly
            </p>
          </div>

          <div>
            <FaStar className="text-4xl mx-auto text-blue-600 mb-4"/>
            <h3 className="font-bold text-xl">Rate Service</h3>
            <p className="text-gray-600">
              Share feedback and ratings
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>© 2026 LocalServe. All Rights Reserved.</p>
      </footer>

    </div>
  );
}