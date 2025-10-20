import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import DetailPage from './pages/DetailPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ForumPage from './pages/ForumPage';
import { BUTA_RANQUIL_DATA, CHOS_MALAL_DATA } from './constants';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buta-ranquil" element={<LocationPage data={BUTA_RANQUIL_DATA} />} />
        <Route path="/chos-malal" element={<LocationPage data={CHOS_MALAL_DATA} />} />
        <Route path="/actividades" element={<ActivitiesPage />} />
        <Route path="/foro" element={<ForumPage />} />
        <Route path="/:location/:page" element={<DetailPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;