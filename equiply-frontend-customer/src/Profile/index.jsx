import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../header';
import Footer from '../Footer';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    label: '',
    type: 'Home',
    address: '',
    phone: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: { 'x-access-token': token }
        });
        
        console.log('Raw API Response:', response.data);
        
        const { user } = response.data;
        
        // Ensure we have valid data
        if (!user) {
          throw new Error('No user data received');
        }

        // Set user data
        setUserData(user);
        setEditedData(user);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put('http://localhost:3000/api/profile', editedData, {
        headers: { 'x-access-token': token }
      });
      
      setUserData(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAddress = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:3000/api/profile/address', newAddress, {
        headers: { 'x-access-token': token }
      });
      
      setUserData(prev => ({
        ...prev,
        addresses: response.data.addresses
      }));
      setIsAddingAddress(false);
      setNewAddress({
        label: '',
        type: 'Home',
        address: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error adding address:', error);
      setError('Failed to add address');
    }
  };

  const handleEditAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('authToken');
      const address = userData.addresses.find(addr => addr._id === addressId);
      const response = await axios.put(`http://localhost:3000/api/profile/address/${addressId}`, address, {
        headers: { 'x-access-token': token }
      });
      
      setUserData(prev => ({
        ...prev,
        addresses: response.data.addresses
      }));
      setEditingAddressId(null);
    } catch (error) {
      console.error('Error updating address:', error);
      setError('Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:3000/api/profile/address/${addressId}`, {
        headers: { 'x-access-token': token }
      });
      
      setUserData(prev => ({
        ...prev,
        addresses: response.data.addresses
      }));
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Failed to delete address');
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    if (editingAddressId) {
      setUserData(prev => ({
        ...prev,
        addresses: prev.addresses.map(addr =>
          addr._id === editingAddressId ? { ...addr, [name]: value } : addr
        )
      }));
    } else {
      setNewAddress(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'addresses' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
              onClick={() => setActiveTab('addresses')}
            >
              Addresses
            </button>
          </div>

          {/* Profile Content */}
          {activeTab === 'profile' && userData && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 text-green-500 hover:text-green-600"
                    >
                      <FaSave />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 text-red-500 hover:text-red-600"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <FaUser className="text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editedData.name || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1">{userData.name || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <FaEnvelope className="text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1">{userData.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <FaPhone className="text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editedData.phone || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1">{userData.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Addresses Content */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Addresses</h2>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                  >
                    <FaPlus />
                    <span>Add Address</span>
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <div className="border rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-medium mb-4">Add New Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Label</label>
                      <input
                        type="text"
                        name="label"
                        value={newAddress.label}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Home, Office"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        name="type"
                        value={newAddress.type}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <textarea
                        name="address"
                        value={newAddress.address}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows="3"
                        placeholder="Enter your full address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleAddressInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddAddress}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {userData?.addresses && userData.addresses.length > 0 ? (
                <div className="space-y-4">
                  {userData.addresses.map((address) => (
                    <div key={address._id} className="border rounded-lg p-4">
                      {editingAddressId === address._id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Label</label>
                            <input
                              type="text"
                              name="label"
                              value={address.label}
                              onChange={handleAddressInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                              name="type"
                              value={address.type}
                              onChange={handleAddressInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              <option value="Home">Home</option>
                              <option value="Office">Office</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                              name="address"
                              value={address.address}
                              onChange={handleAddressInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              rows="3"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={address.phone}
                              onChange={handleAddressInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingAddressId(null)}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleEditAddress(address._id)}
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{address.label}</p>
                            <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                            <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
                          </div>
                          <div className="flex space-x-2">
                            {address.isDefault && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Default
                              </span>
                            )}
                            <button
                              onClick={() => setEditingAddressId(address._id)}
                              className="text-blue-500 hover:text-blue-600"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No addresses found.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;