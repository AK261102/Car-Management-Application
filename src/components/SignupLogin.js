import React, { useState } from 'react';
import axios from 'axios';

function SignupLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5001/api/users/signup', 
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('token', res.data.token);
      setUsername('');
      setPassword('');
      window.location = '/cars';
    } catch (err) {
      console.error("Error during Signup:", err.response ? err.response.data : err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5001/api/users/login', 
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('token', res.data.token);
      setUsername('');
      setPassword('');
      window.location = '/cars';
    } catch (err) {
      console.error("Error during Login:", err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 shadow-lg rounded-lg bg-white border">
      <h2 className="text-3xl font-bold text-center mb-6">Sign Up / Login</h2>
      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-4 p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex justify-between">
        <button onClick={handleSignup} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">Sign Up</button>
        <button onClick={handleLogin} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">Login</button>
      </div>
    </div>
  );
}

export default SignupLogin;
