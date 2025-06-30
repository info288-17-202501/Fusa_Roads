import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MenuCentral from './MenuCentral/MenuCentral'; 
import SeccioneCalles from './SeccionesCalles/SeccionesCalles'
import Videos from './Videos/Videos'
import ModelosIA from './ModelosIA/ModelosIA'
import MonitorProcesos from './MonitorProcesos/MonitorProcesos'
import Login from './Login/Login'
import Profile from './Login/Profile';
import SignUp from './Login/SignUp';
import PuntosVideo from './test/puntosVideo';

import NavigationBar from './components/NavigationBar';
import PrivateRoute from './components/PrivateRoute';


const App: React.FC = () => {
  	return (
    	<Router>
      		<NavigationBar/>
      		<Routes>
        		<Route path="/" element={<Navigate to="/home" />} /> 
				<Route path="/home" element={<MenuCentral/>} /> 
				<Route path="/secciones-calles" element={<PrivateRoute><SeccioneCalles/></PrivateRoute>} /> 
				<Route path="/videos" element={<Videos/>} /> 
				<Route path="/modelos-ia" element={<ModelosIA/>} />
				<Route path="/monitor-procesos" element={<MonitorProcesos/>} />
				<Route path="/login" element={<Login/>} />
				<Route path="/perfil" element={<Profile/>} />
				<Route path="/sign-up" element={<SignUp/>} />
				<Route path="/test" element={<PuntosVideo/>} />
      		</Routes>
    	</Router>
  	);
};

export default App;

