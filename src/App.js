import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SightingPage } from './sightings/SightingPage';
import { SightingsTable } from './sightings/SightingsTable';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sightings" element={<SightingsTable />} />
        <Route path="/sightings/:reportNumber" element={<SightingPage />} />
        <Route path="*" element={<Navigate to="/sightings" />} />
      </Routes>
    </BrowserRouter>
  );
}
