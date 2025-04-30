import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home'; 
import SeccioneCalles from './pages/SeccionesCalles'
import Videos from './pages/Videos'

import NavigationBar from './components/NavigationBar';


const App: React.FC = () => {
  	return (
    	<Router>
      		<NavigationBar/>
      		<Routes>
        		<Route path="/" element={<Navigate to="/home" />} /> 
				<Route path="/home" element={<Home/>} /> 
				<Route path="/secciones-calles" element={<SeccioneCalles/>} /> 
				<Route path="/videos" element={<Videos/>} /> 
      		</Routes>
    	</Router>
  	);
};

export default App;

