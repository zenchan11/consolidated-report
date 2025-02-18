import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import DyeingReports from './components/DyeingReports';
import DyeingMasters from './components/DyeingMasters';
import YarnIssued from './components/YarnIssued';
import TotalSqmtOfCarpets from './components/TotalSqmtOfCarpets';
import Available from './components/Available';
import Dashboard from './components/Dashboard';
import YarnOverview from './components/YarnOverview';
import TotalColors from './components/TotalColors';
import ProtectedRoute from './components/ProtectedRoute';
import './App.scss';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="app">
        {/* Sidebar navigation */}
        <aside className="sidebar">
          <div className="logo">
            <Link to="/" className="text_none">My App Testing</Link>
          </div>
          <div className="links">
            <ul>
              <span className="spann">Navigation</span>
              <li>
                <Link to="/dashboard" className="text_none">
                  <span className="icon">🏠</span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/total-sqmt-of-carpets" className="text_none">
                  <span className="icon">📐</span>
                  Total Sqmt of Carpets
                </Link>
              </li>
              <li>
                <Link to="/yarn-overview" className="text_none">
                  <span className="icon">🧵</span>
                  Yarn Overview
                </Link>
              </li>
              <li>
                <Link to="/yarn-issued" className="text_none">
                  <span className="icon">📜</span>
                  Yarn Issued
                </Link>
              </li>
              <li>
                <Link to="/dyeing-reports" className="text_none">
                  <span className="icon">📊</span>
                  Dyeing Reports
                </Link>
              </li>
              <li>
                <Link to="/dyeing-masters" className="text_none">
                  <span className="icon">🧶</span>
                  Dyeing Masters
                </Link>
              </li>
              <li>
                <Link to="/available" className="text_none">
                  <span className="icon">✔️</span>
                  Available
                </Link>
              </li>
              <li>
                <Link to="/total-colors" className="text_none">
                  <span className="icon">🎨</span>
                  Total Colors
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dyeing-reports"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <DyeingReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dyeing-masters"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <DyeingMasters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/yarn-issued"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <YarnIssued />
                </ProtectedRoute>
              }
            />
            <Route
              path="/total-sqmt-of-carpets"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <TotalSqmtOfCarpets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/available"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Available />
                </ProtectedRoute>
              }
            />
            <Route
              path="/yarn-overview"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <YarnOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/total-colors"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <TotalColors />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;