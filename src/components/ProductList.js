import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [cars, setCars] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = `Bearer ${localStorage.getItem('token')}`;
        const res = await axios.get('http://localhost:5001/api/cars', {
          headers: {
            Authorization: token
          }
        });
        setCars(res.data);
      } catch (err) {
        console.error('Error fetching cars:', err.message);
      }
    };
    fetchCars();
  }, []);

  const handleSearch = async () => {
    try {
      const token = `Bearer ${localStorage.getItem('token')}`;
      const res = await axios.get(`http://localhost:5001/api/cars/search?keyword=${keyword}`, {
        headers: {
          Authorization: token
        }
      });
      setCars(res.data);
    } catch (err) {
      console.error('Error searching cars:', err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h2 className="text-4xl font-bold mb-6">Your Cars</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search cars"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="p-3 border rounded w-2/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button onClick={handleSearch} className="ml-4 bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 transition">Search</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car._id} className="p-6 bg-white shadow-lg rounded-lg border hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-2">{car.title}</h3>
            <p className="mb-3">{car.description}</p>
            <p className="text-gray-600 mb-4">Tags: {car.tags.join(', ')}</p>
            <a href={`/cars/${car._id}`} className="text-blue-600 hover:underline">View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
