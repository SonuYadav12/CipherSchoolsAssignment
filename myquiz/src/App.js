import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import StudentHome from './pages/StudentHome'; 
import AdminPage from './pages/AdminPage';
import Test from './pages/Test';
import { getToken, decodeToken } from './utils/tokenUtils';

const App = () => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setRole(decodedToken.role);
        setAuth(true);
      } else {
        setAuth(false);
      }
    } else {
      setAuth(false);
    }
    setLoading(false); 
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/login"
            element={auth ? (role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/student-home" />) : <Login setAuth={setAuth} />}
          />
          <Route
            path="/signup"
            element={auth ? <Navigate to={role === 'admin' ? "/admin" : "/student-home"} /> : <SignUp />}
          />
          <Route
            path="/student-home"
            element={auth ? (role === 'admin' ? <Navigate to="/admin" /> : <StudentHome />) : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={auth ? (role === 'admin' ? <AdminPage /> : <Navigate to="/student-home" />) : <Navigate to="/login" />}
          />
          <Route
            path="/test/:id"  
            element={auth ? <Test /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={auth ? (role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/student-home" />) : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;