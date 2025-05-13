import { FaBell, FaHeart, FaUserCircle, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-[#0D2C85] text-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-3xl font-bold font-['Inknut_Antiqua']">Equiply</h1>
        <div className="flex items-center space-x-1 text-sm">
          <FaMapMarkerAlt className="text-white" />
          <span>Bengluru</span>
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
