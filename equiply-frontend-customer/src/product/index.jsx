import React, { useState } from 'react'
import Header from '../header';
import Footer from '../Footer';

const Product = () => {
  const products = [
    {
      id: 1,
      name: "Apple iPhone 11 128GB White (MQ233)",
      price: "$510",
      image: "www.image.com",
    },
    {
      id: 2,
      name: "Apple iPhone 11 128GB White (MQ233)",
      price: "$510",
      image: "www.image.com",
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col lg:flex-row p-6 gap-6 flex-grow">
        <aside className="w-full lg:w-1/5 space-y-4">
          <h2 className="font-semibold text-lg">Filter</h2>
          <input
            type="text"
            placeholder="Search"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <div className="space-y-2 text-sm">
            <div className="font-medium">Mobile</div>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Mobile
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Electronics
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> House Appliances
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Accessories
            </label>
          </div>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 flex flex-col items-center text-center"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-28 h-28 object-contain mb-4"
                />
                <h3 className="text-sm font-medium mb-2">{product.name}</h3>
                <p className="text-lg font-bold mb-2">{product.price}</p>
                <button className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default Product