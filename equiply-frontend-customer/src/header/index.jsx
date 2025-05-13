import { FaBell, FaHeart, FaUserCircle, FaMapMarkerAlt, FaSearch, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import indianCities from "../data/cities";

const Header = () => {
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#0D2C85] text-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-3xl font-bold font-['Inknut_Antiqua']">Equiply</h1>
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center space-x-1 text-sm cursor-pointer hover:text-gray-200"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaMapMarkerAlt className="text-white" />
            <span>{selectedCity}</span>
            <FaChevronDown className="text-xs" />
          </div>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white text-black shadow-lg rounded-md py-2 z-10 max-h-60 overflow-y-auto w-48">
              {indianCities.map((city, index) => (
                <div 
                  key={index} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setSelectedCity(city);
                    setIsDropdownOpen(false);
                  }}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 mx-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-md text-black text-sm placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-white text-lg">
        <FaBell className="cursor-pointer" />
        <FaHeart className="cursor-pointer" />
        <div className="flex items-center space-x-2">
          <Link to="/login" className="text-sm hover:underline">Login</Link>
          <span>/</span>
          <Link to="/Signup" className="text-sm hover:underline">Signup</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
