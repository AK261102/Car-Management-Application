import React, { useState } from 'react';
import axios from 'axios';

function ProductCreation() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setImages([...e.target.files]); // Convert FileList to Array for better handling
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const token = `Bearer ${localStorage.getItem('token')}`;
      await axios.post('http://localhost:5001/api/cars', formData, {
        headers: {
          Authorization: token,
        },
      });
      window.location = '/cars';
    } catch (err) {
      if (err.response) {
        console.error('Error response:', err.response.data);
      } else if (err.request) {
        console.error('Error request:', err.request);
      } else {
        console.error('General Error:', err.message);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg border">
      <h2 className="text-3xl font-bold mb-6 text-center">Add a New Car</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition mt-4"
      >
        Add Car
      </button>
    </div>
  );
}

export default ProductCreation;
