import { FaBell, FaHeart, FaUserCircle, FaMapMarkerAlt, FaSearch, FaChevronDown, FaSignOutAlt, FaUser, FaClipboardList, FaUpload } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import indianCities from "../data/cities";

const Header = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    
    navigate('/');
    window.location.reload();
  };

  const handleMenuNavigation = (path) => {
    setIsUserMenuOpen(false);
    navigate(path);
  };

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
        {isLoggedIn ? (
          <div className="relative" ref={userMenuRef}>
            <div 
              className="cursor-pointer"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <FaUserCircle className="text-2xl" />
            </div>
            
            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white text-black shadow-lg rounded-md py-2 z-20 w-48">
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleMenuNavigation('/profile')}
                >
                  <FaUser className="mr-2 text-sm" />
                  <span>Profile</span>
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleMenuNavigation('/History')}
                >
                  <FaClipboardList className="mr-2 text-sm" />
                  <span>Orders</span>
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleMenuNavigation('/PutRent')}
                >
                  <FaUpload className="mr-2 text-sm" />
                  <span>Put for Rent</span>
                </div>
                <hr className="my-1" />
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-red-600"
                  onClick={handleSignOut}
                >
                  <FaSignOutAlt className="mr-2 text-sm" />
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/login" className="text-sm hover:underline">Login</Link>
            <span>/</span>
            <Link to="/Signup" className="text-sm hover:underline">Signup</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
