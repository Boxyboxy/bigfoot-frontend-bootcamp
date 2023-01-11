import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SightingPage, SightingsTable, NewSightingPage } from './sightings/pages';
import { Home } from './Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />}>
          <Route path="/sightings" element={<SightingsTable />} />
          <Route path="/sightings/new" element={<NewSightingPage />} />
          <Route path="/sightings/:reportNumber" element={<SightingPage />} />
          <Route path="*" element={<Navigate to="/sightings" />} />
        </Route>
        <Route path="*" element={<Navigate to="/sightings" />} />
      </Routes>
    </BrowserRouter>
  );
}
