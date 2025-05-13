import React from 'react'
import { Link } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc"

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div>
            <h3 className="text-center text-4xl mb-1">Log in</h3>
            <p className="text-center text-lg mb-8">Don't have an account? <Link to="/Signup" className="text-blue-600 hover:underline">Signup</Link></p>
        </div>
        <div className="flex items-center justify-center px-4">   
            <form className="w-full max-w-2xl p-6 space-y-6">
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Email address
                  <input type="text" placeholder="Enter your email address" required className="w-full px-4 py-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                </label>
              </div>
              
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Password
                  <input type="password" placeholder="Enter your password" required className="w-full px-4 py-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                </label>
                <label className='flex mt-2'>
                  <input type="checkbox"/>
                  <p className='p-2'>Remember me</p>
                </label>
              </div>
              
              <div>
                <p className="text-xs text-gray-600">By creating an account, you agree to the{" "}<a href="#" className="text-blue-600 underline">Terms of use</a>{" "}and{" "}<a href="#" className="text-blue-600 underline">Privacy Policy</a>.</p>
                <button className="mt-4 w-full py-3 bg-gray-200 text-gray-500 font-medium text-sm rounded-full cursor-not-allowed">Log in</button>
              </div>
              
              <div className='text-center'>
                <p className="text-neutral-900 text-base font-medium underline">Forgot Password?</p>
              </div>
              
              <div className="text-center text-sm text-gray-500">OR Continue with</div>
              
              <button type="button" className="flex items-center justify-center w-1/4 mx-auto border border-gray-300 py-3 rounded-full hover:bg-gray-100 transition">
                <FcGoogle className="text-xl mr-2" /> Google
              </button>
            </form>
        </div>
    </div>
  )
}

export default Login