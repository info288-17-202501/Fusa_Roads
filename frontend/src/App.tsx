import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'; 
import SeccioneCalles from './pages/SeccionesCalles'


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> 
        <Route path="/home" element={<Home/>} /> 
        <Route path="/secciones-calles" element={<SeccioneCalles/>} /> 


      </Routes>
    </Router>
  );
};

export default App;

