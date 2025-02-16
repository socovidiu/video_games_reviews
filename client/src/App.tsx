import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameDetailsPage from './pages/GameDetailsPage'; 
import Login from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUpPage";
import Settings from "./pages/Settings";
import { AuthProvider } from "./context/AuthContext";
import './App.css'




const App: React.FC = () => {

  return (
    <AuthProvider>
      <Router>
        <div className=" bg-gray-100 min-h-screen  pt-8 min-w-auto">
          <Navbar />
          <div className="container mx-auto mt-8 min-w-auto ">
            <Routes>z``
              <Route path="/" element={<HomePage />} />
              <Route path="/games/:id" element={<GameDetailsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App
