import React, { useState } from "react";
import { Route, Routes, Link, useLocation, Navigate } from "react-router-dom";
import Login from "./components/Login";
import DyeingReports from "./components/DyeingReports";
import DyeingMasters from "./components/DyeingMasters";
import YarnIssued from "./components/YarnIssued";
import TotalSqmtOfCarpets from "./components/TotalSqmtOfCarpets";
import Available from "./components/Available";
import Dashboard from "./components/Dashboard";
import YarnOverview from "./components/YarnOverview";
import TotalColors from "./components/TotalColors";
import ProtectedRoute from "./components/ProtectedRoute";
import logo from './tibetcarpetlogo.png';
import "./App.scss";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return (
    <div className="app">
      {!isLoginPage && (
        <aside className="sidebar">
          <div className="logo">
          <Link to="/" className="text_none" style={{ display: 'flex', alignItems: 'center' }}><img src={logo} alt="Tibet Carpet Logo" style={{ width: '50px', marginRight: '10px' }} />TIBET CARPET</Link>
            {/* <Link to="/" className="text_none"><img src={logo} alt='' style={{ width: '50px', marginRight: '10px' }}></img>TIBET CARPET</Link> */}
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
      )}

      <main className={`content ${isLoginPage ? "full-page" : ""}`}>
        <Routes>
          {/* Redirect to Dashboard if already authenticated */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
            }
          />

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
  );
}

export default App;
