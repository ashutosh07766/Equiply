import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc"

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profileName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Check if form is valid whenever formData changes
    const { profileName, email, password, phone } = formData;
    const isValid = 
      profileName.trim() !== "" && 
      email.trim() !== "" && 
      password.length >= 8;
    
    setIsFormValid(isValid);
  }, [formData]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.profileName,
          email: formData.email,
          password: formData.password,
          phone: parseInt(formData.phone, 10)
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
      }
      
      console.log("Signup successful:", data);
      navigate('/');
      window.location.reload();
      
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <h1 className="text-center text-4xl  mb-1">Create an account</h1>
      <p className="text-center text-lg mb-8">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
      
      <div className="flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl p-6 space-y-6"
        >
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

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
              className="w-full px-4 py-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-4 py-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm pr-16 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 font-medium text-sm rounded-full ${
              isFormValid && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Creating account..." : "Create an account"}
          </button>

          <div className="text-center text-sm text-gray-500">OR Continue with</div>

          <button
            type="button"
            className="flex items-center justify-center w-1/4 mx-auto border border-gray-300 py-3 rounded-full hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-xl mr-2" /> Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup