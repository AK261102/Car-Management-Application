import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? 'signup' : 'login';
      const res = await axios.post(`http://localhost:5001/api/users/${endpoint}`, { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/cars');
    } catch (err) {
      console.error('Error during authentication:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">{isSignup ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button type="submit" className="w-full bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 transition">
          {isSignup ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      <div className="flex justify-between items-center mt-6">
        <button onClick={() => setIsSignup(!isSignup)} className="text-blue-600 hover:underline">
          {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </button>
        <button onClick={handleLogout} className="text-red-600 hover:underline">
          Log Out
        </button>
      </div>
    </div>
  );
}

export default SignupLogin;
