import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc"

const Signup = () => {
  const [formData, setFormData] = useState({
    profileName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <h1 style={{textAlign:'center', fontSize:'32'}}>Create an account</h1>
      <p style={{textAlign:'center', fontSize:'16'}}>Already have a account? <Link to="/login">Login</Link></p>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-6 space-y-6"
        >
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              What should we call you?
            </label>
            <input
              type="text"
              name="profileName"
              placeholder="Enter your profile name"
              value={formData.profileName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">
              What's your email?
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Create a password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm pr-16 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>
          </div>

          <p className="text-xs text-gray-600">
            By creating an account, you agree to the{" "}
            <a href="#" className="text-blue-600 underline">
              Terms of use
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline">
              Privacy Policy
            </a>
            .
          </p>

          <button
            type="submit"
            disabled
            className="w-full py-3 bg-gray-200 text-gray-500 font-medium text-sm rounded-full cursor-not-allowed"
          >
            Create an account
          </button>

          <div className="text-center text-sm text-gray-500">OR Continue with</div>

          <button
            type="button"
            className="flex items-center justify-center w-full border border-gray-300 py-3 rounded-full hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-xl mr-2" /> Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup