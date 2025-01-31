import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameDetailsPage from './pages/GameDetailsPage'; // To be created
import './App.css'

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games/:id" element={<GameDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App
