import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MenuCentral from './MenuCentral/MenuCentral'; 
import SeccioneCalles from './SeccionesCalles/SeccionesCalles'
import Videos from './Videos/Videos'

import NavigationBar from './components/NavigationBar';


const App: React.FC = () => {
  	return (
    	<Router>
      		<NavigationBar/>
      		<Routes>
        		<Route path="/" element={<Navigate to="/home" />} /> 
				<Route path="/home" element={<MenuCentral/>} /> 
				<Route path="/secciones-calles" element={<SeccioneCalles/>} /> 
				<Route path="/videos" element={<Videos/>} /> 
      		</Routes>
    	</Router>
  	);
};

export default App;

