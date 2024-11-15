import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function ProductList() {
  const [cars, setCars] = useState([]);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = `Bearer ${localStorage.getItem('token')}`;
        const res = await axios.get('http://localhost:5001/api/cars', {
          headers: {
            Authorization: token,
          },
        });
        setCars(res.data);
      } catch (err) {
        console.error('Error fetching cars:', err);
      }
    };
    fetchCars();
  }, []);

  const handleSearch = async () => {
    const trimmedKeyword = keyword;
  
    if (!trimmedKeyword) {
      alert('Please enter a valid keyword for search.');
      return;
    }
  
    try {
      const token = `Bearer ${localStorage.getItem('token')}`;
      console.log('Searching with keyword:', trimmedKeyword); // Log the keyword for debugging
  
      // Make the API request to the backend
      const res = await axios.get(`http://localhost:5001/api/cars/search?trimmedKeyword}`, {
        headers: {
          Authorization: token,
        },
      });
  
      // Check and handle the response
      if (res.status === 200) {
        if (res.data.length === 0) {
          alert('No cars found matching the search keyword.');
        } else {
          setCars(res.data);
        }
      }
    } catch (err) {
      console.error('Error searching cars:', err);
  
      if (err.response) {
        if (err.response.status === 400) {
          alert(err.response.data.message || 'Invalid search keyword. Please try again.');
        } else if (err.response.status === 404) {
          alert('No cars found matching the search keyword.');
        } else {
          alert('An error occurred while searching. Please try again.');
        }
      } else {
        alert('Unable to search at the moment. Please try again later.');
      }
    }
  };
  
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to login/signup page after logout
  };

  const handleAddCar = () => {
    navigate('/add-car'); // Assuming you have a route for adding a car
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Cars</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleAddCar}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add Car
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </div>
      <div className="flex mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search cars"
          className="flex-grow p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-3 ml-2 rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car._id} className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-2xl font-bold mb-2">{car.title}</h3>
            <p className="mb-4">{car.description}</p>
            <p className="text-gray-600 mb-4">Tags: {car.tags.join(', ')}</p>
            <Link
              to={`/cars/${car._id}`}
              className="text-blue-500 hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
