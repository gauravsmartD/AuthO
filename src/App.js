import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Authenticate from './components/Authenticate.js';
import allRoutes from './routes/allroutes.js';
import ProtectedRouted from './routes/ProtectedRoutes.js';

function App() {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route exact path="/authenticate" element={<Authenticate />} />
        <Route element={<ProtectedRouted />}>
                  {allRoutes?.map((route, id) => (
                    <Route
                      path={route.path}
                      element={<route.component />}
                      key={id}
                      exact
                    />
                  ))}
                </Route>
      </Routes>
    </Router>
  );
}

export default App;
