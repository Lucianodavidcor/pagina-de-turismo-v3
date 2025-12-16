import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
// import DetailPage from './pages/DetailPage'; // Lo veremos luego
// import ActivitiesPage from './pages/ActivitiesPage';
// import ForumPage from './pages/ForumPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Usamos el componente conectado a la API pasando el slug */}
        <Route path="/buta-ranquil" element={<LocationPage slugProp="buta-ranquil" />} />
        <Route path="/chos-malal" element={<LocationPage slugProp="chos-malal" />} />
        
        {/* ... el resto de rutas ... */}
      </Routes>
    </HashRouter>
  );
};

export default App;