import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AlertsPage from './pages/AlertsPage';
import Logo from './components/Logo';
import './App.css';

/**
 * Main App Component
 * 
 * Uses React Router for navigation between pages
 */

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-brand">
              <Logo size={50} color="#ffffff" /> AI Smart Crosswalk
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/about" className="nav-link">About</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<AlertsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Simple About Page
function AboutPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1><Logo size={70} /> About AI Smart Crosswalk</h1>
      <p>AI-powered crosswalk monitoring system for pedestrian safety</p>
      <p>Built with React, Node.js, Express, and MongoDB</p>
    </div>
  );
}

export default App;
