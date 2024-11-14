import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const token = `Bearer ${localStorage.getItem('token')}`;
        const res = await axios.get(`http://localhost:5001/api/cars/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        setCar(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setTags(res.data.tags.join(', '));
      } catch (err) {
        console.error('Error fetching car details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleUpdate = async () => {
    if (!title || !description) {
      alert('Title and Description are required');
      return;
    }
    try {
      const token = `Bearer ${localStorage.getItem('token')}`;
      await axios.put(`http://localhost:5001/api/cars/${id}`, { title, description, tags: tags.split(', ') }, {
        headers: {
          Authorization: token,
        },
      });
      setCar({ ...car, title, description, tags: tags.split(', ') });
      setEditMode(false);
    } catch (err) {
      console.error('Error updating car details:', err);
    }
  };

  const handleDelete = async () => {
    try {
      const token = `Bearer ${localStorage.getItem('token')}`;
      await axios.delete(`http://localhost:5001/api/cars/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      navigate('/cars');
    } catch (err) {
      console.error('Error deleting car:', err);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!car) {
    return <div className="text-center mt-20">Car not found or data is still loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Car Details</h2>
      {editMode ? (
        <>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type='text'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 transition mr-3">Update</button>
          <button onClick={() => setEditMode(false)} className="bg-gray-600 text-white px-5 py-3 rounded hover:bg-gray-700 transition">Cancel</button>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold mb-3">{car.title}</h3>
          <p className="mb-3">{car.description}</p>
          <p className="text-gray-600 mb-4">Tags: {car.tags.join(', ')}</p>
          {car.images && car.images.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xl font-bold mb-2">Images</h4>
              <div className="grid grid-cols-2 gap-4">
                {car.images.map((image, index) => (
                  <img
                    key={index}
                    src={image} // Use the full URL for the image
                    alt={`Car ${index + 1}`}
                    className="w-full h-48 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
          <button onClick={() => setEditMode(true)} className="bg-yellow-500 text-white px-5 py-3 rounded hover:bg-yellow-600 transition mr-3">Edit</button>
          <button onClick={handleDelete} className="bg-red-600 text-white px-5 py-3 rounded hover:bg-red-700 transition">Delete</button>
        </>
      )}
    </div>
  );
}

export default ProductDetail;
