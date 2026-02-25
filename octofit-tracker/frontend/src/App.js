import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="hero-section">
          <img
            src={`${process.env.PUBLIC_URL}/octofitapp-small.png`}
            alt="OctoFit"
            height="80"
            className="mb-3 rounded-circle border border-3 border-white"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1>Welcome to OctoFit Tracker</h1>
          <p>Track your fitness activities, compete with your team, and improve your workouts.</p>
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
            {['Users', 'Teams', 'Activities', 'Leaderboard', 'Workouts'].map((label) => (
              <NavLink
                key={label}
                to={`/${label.toLowerCase()}`}
                className="btn btn-light btn-sm fw-semibold"
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
          <div className="container">
            <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
              <img
                src={`${process.env.PUBLIC_URL}/octofitapp-small.png`}
                alt="OctoFit"
                height="32"
                className="rounded-circle"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="fw-bold">OctoFit Tracker</span>
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {['Users', 'Teams', 'Activities', 'Leaderboard', 'Workouts'].map((label) => (
                  <li key={label} className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link${isActive ? ' active' : ''}`
                      }
                      to={`/${label.toLowerCase()}`}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-4 pb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;


