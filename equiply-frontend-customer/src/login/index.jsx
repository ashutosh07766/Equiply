import React from 'react'
import { Link } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc"

const Login = () => {
  return (
    <div className="pt-[72px] pr-[430px] pb-[116px] pl-[430px] flex flex-col gap-[32px]">
        <div>
            <h3 className="text-center justify-center text-zinc-800 text-3xl font-medium font-['Poppins']">Log in</h3>
        </div>
        <div>   
            <form className="flex flex-col gap-[24px]">
              <lable className="block mb-1 text-sm text-gray-600">
                Email address
                <div>
                  
                <input type="text" className="w-full px-4 py-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                </div>
              </lable>
              <lable className="block mb-1 text-sm text-gray-600">
                Password
                <div>
                <input type="password" className="w-full px-4 py-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                </div>
                <label className='flex'>
                <input type="checkbox"/>
                <p className='p-2'>Remember me</p>
              </label>
              </lable>
              <div>
              <p className="text-xs text-gray-600">By creating an account, you agree to the{" "}<a href="#" className="text-blue-600 underline">Terms of use</a>{" "}and{" "}<a href="#" className="text-blue-600 underline">Privacy Policy</a>.</p>
              <button className="mt-[2px] w-full py-3 bg-gray-200 text-gray-500 font-medium text-sm rounded-full cursor-not-allowed pt-[2]" >Log in</button>
              </div>
            </form> 
            <div className='mt-[24px] flex flex-col gap-[24px] text-center'>
            <p className="justify-start text-neutral-900 text-base font-medium font-['Poppins'] underline">Forgot Password?</p>
              <p className="text-stone-500 text-base font-normal font-['Poppins']">Don't have an account? <Link to="/Signup" className="  text-neutral-900 text-base font-medium font-['Poppins'] underline">Signup</Link></p>
              </div>
              <p className='text-center mt-[48px] text-sm text-gray-500'>Or continue with</p>
             <button type="button"className="flex items-center justify-center w-1/4 mx-auto border border-gray-300 py-3 rounded-full hover:bg-gray-100 transition"><FcGoogle className="text-xl mr-2" /> Google</button>
        </div>
    </div>
  )
}

export default Login