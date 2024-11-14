import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupLogin from './components/SignupLogin';
import ProductList from './components/ProductList';
import ProductCreation from './components/ProductCreation';
import ProductDetail from './components/ProductDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignupLogin />} />
        <Route path='/cars' element={<ProductList />} />
        <Route path='/add-car' element={<ProductCreation />} />
        <Route path='/cars/:id' element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
