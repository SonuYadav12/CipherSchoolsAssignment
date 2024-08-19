import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Test from './pages/Test';

function App() {
  const [auth, setAuth] = useState(false);

  return (
    <Router>
      <div>
        <Routes>
          <Route 
            path="/login" 
            element={auth ? <Navigate to="/home" /> : <Login setAuth={setAuth} />} 
          />
          <Route 
            path="/signup" 
            element={auth ? <Navigate to="/home" /> : <SignUp />} 
          />
          <Route 
            path="/home" 
            element={auth ? <Home /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/test" 
            element={auth ? <Test /> : <Navigate to="/login" />} 
          />
         
          <Route 
            path="/" 
            element={auth ? <Navigate to="/home" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
