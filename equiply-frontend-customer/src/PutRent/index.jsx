import React, { useState } from "react";
import Header from "../header";

const PutRent = () => {
  const [ratePeriod, setRatePeriod] = useState("days");

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="flex gap-[180px] mt-8">
          <div className="w-96 h-96 bg-gray-200 rounded shadow-[0px_24px_24px_0px_rgba(0,0,0,0.05)] border border-blue-800/30">
            <div className=" mt-[230px] text-center justify-center">
              <span className="text-stone-950 text-base font-bold font-['Poppins'] leading-normal">
                Drag & drop files or
              </span>
              <span className="text-zinc-800 text-base font-bold font-['Poppins'] leading-normal">
                {" "}
              </span>
              <span className="text-indigo-800 text-base font-bold font-['Poppins'] underline leading-normal">
                Browse
              </span>
            </div>
            <div className="text-center justify-center text-stone-500 text-xs font-normal font-['Poppins'] leading-none">
              Supported formates: JPEG, PNG
            </div>
          </div>
          <div className="w-[500px] space-y-8">
            <label className="block text-stone-500 text-lg font-normal font-['Poppins']">
              Product Name
              <input
                className="w-full mt-2 px-6 py-5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-['Poppins']"
                placeholder="Enter product name"
              />
            </label>

            <label className="block text-stone-500 text-lg font-normal font-['Poppins']">
              Product Description
              <textarea
                className="w-full mt-2 px-6 py-5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-['Poppins'] min-h-[120px] resize-none"
                placeholder="Enter product description"
              />
            </label>

            <label className="block text-stone-500 text-lg font-normal font-['Poppins']">
              Product Address
              <input
                className="w-full mt-2 px-6 py-5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-['Poppins']"
                placeholder="Enter pickup address"
              />
            </label>

            <div className="flex gap-4">
              <label className="block text-stone-500 text-lg font-normal font-['Poppins'] flex-1">
                Product Price
                <div className="relative">
                  <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                  </span>
                  <input
                    type="number"
                    className="w-full mt-2 pl-10 pr-6 py-5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-['Poppins']"
                    placeholder="0.00"
                  />
                </div>
              </label>

              <label className="block text-stone-500 text-lg font-normal font-['Poppins'] flex-1">
                Rate Per
                <select
                  value={ratePeriod}
                  onChange={(e) => setRatePeriod(e.target.value)}
                  className="w-full mt-2 px-6 py-5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-['Poppins'] appearance-none bg-white cursor-pointer"
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PutRent;
