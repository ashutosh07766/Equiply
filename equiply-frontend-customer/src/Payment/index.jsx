import React, { useState } from 'react';
import { FaEdit, FaCreditCard, FaPaypal } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import Header from "../header";
import Footer from "../Footer";

const Payment = () => {
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState(1);

  const addresses = [
    {
      id: 0,
      label: "2118 Thornridge",
      type: "Home",
      address: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
      phone: "(209) 555-0104",
    },
    {
      id: 1,
      label: "Headoffice",
      type: "Office",
      address: "2715 Ash Dr. San Jose, South Dakota 83475",
      phone: "(704) 555-0127",
    },
  ];

  const orderSummary = {
    items: [
      { name: "Industrial Drill", days: 3, price: 75.00 },
      { name: "Safety Helmet", days: 3, price: 15.00 }
    ],
    subtotal: 90.00,
    tax: 7.20,
    total: 97.20
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderAddressSection = () => (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-1">Step 1</h2>
        <h1 className="text-2xl font-bold">Address</h1>
      </div>

      <h3 className="text-md font-medium mb-4">Select Address</h3>

      {addresses.map((addr) => (
        <div
          key={addr.id}
          className={`flex items-start justify-between p-4 mb-4 rounded-lg border ${
            selectedAddress === addr.id ? "border-black" : "border-gray-300"
          } bg-gray-50`}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              checked={selectedAddress === addr.id}
              onChange={() => setSelectedAddress(addr.id)}
              className="mt-1"
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{addr.label}</p>
                <span className="text-xs px-2 py-0.5 bg-black text-white rounded">
                  {addr.type.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-1">{addr.address}</p>
              <p className="text-gray-600 text-sm">{addr.phone}</p>
            </div>
          </div>
          <div className="flex gap-4 text-gray-500">
            <FaEdit className="cursor-pointer" />
            <MdClose className="cursor-pointer" />
          </div>
        </div>
      ))}

      <div className="text-center py-6">
        <button className="text-black flex items-center gap-2 mx-auto">
          <span className="text-xl">+</span> Add New Address
        </button>
      </div>
    </>
  );

  const renderPaymentMethodSection = () => (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-1">Step 2</h2>
        <h1 className="text-2xl font-bold">Payment Method</h1>
      </div>

      <div className="space-y-4 mb-6">
        <div
          className={`p-4 border rounded-lg flex items-center gap-4 cursor-pointer ${
            paymentMethod === 'card' ? 'border-black' : 'border-gray-300'
          }`}
          onClick={() => setPaymentMethod('card')}
        >
          <input
            type="radio"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
          />
          <FaCreditCard className="text-xl" />
          <span className="font-medium">Credit/Debit Card</span>
        </div>

        <div
          className={`p-4 border rounded-lg flex items-center gap-4 cursor-pointer ${
            paymentMethod === 'paypal' ? 'border-black' : 'border-gray-300'
          }`}
          onClick={() => setPaymentMethod('paypal')}
        >
          <input
            type="radio"
            checked={paymentMethod === 'paypal'}
            onChange={() => setPaymentMethod('paypal')}
          />
          <FaPaypal className="text-xl" />
          <span className="font-medium">PayPal</span>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">CVC</label>
              <input
                type="text"
                placeholder="123"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name on Card</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );

  const renderReviewSection = () => (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-1">Step 3</h2>
        <h1 className="text-2xl font-bold">Review & Confirm</h1>
      </div>

      <div className="border rounded-lg mb-6">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Delivery Address</h3>
          <div className="mt-2 text-sm">
            <p className="font-medium">{addresses[selectedAddress].label}</p>
            <p>{addresses[selectedAddress].address}</p>
            <p>{addresses[selectedAddress].phone}</p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold">Payment Method</h3>
          <div className="mt-2 flex items-center gap-2">
            {paymentMethod === 'card' ? (
              <>
                <FaCreditCard />
                <span>Credit/Debit Card ending in 3456</span>
              </>
            ) : (
              <>
                <FaPaypal />
                <span>PayPal</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-3">
          {orderSummary.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">{item.days} days rental</p>
              </div>
              <p>${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-3">
          <div className="flex justify-between text-sm">
            <p>Subtotal</p>
            <p>${orderSummary.subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <p>Tax</p>
            <p>${orderSummary.tax.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-semibold text-base mt-3">
            <p>Total</p>
            <p>${orderSummary.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen p-8 bg-white flex flex-col justify-center items-center">
        <div className="w-full max-w-3xl">
          {step === 1 && renderAddressSection()}
          {step === 2 && renderPaymentMethodSection()}
          {step === 3 && renderReviewSection()}

          <div className="flex justify-between mt-6">
            <button 
              className="px-6 py-2 border border-black rounded"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </button>
            {step < 3 ? (
              <button 
                className="px-6 py-2 bg-black text-white rounded"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button 
                className="px-6 py-2 bg-black text-white rounded"
              >
                Confirm Payment
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Payment;