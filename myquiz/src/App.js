import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import StudentHome from './pages/StudentHome';
import AdminPage from './pages/AdminPage';
import TestPage from './pages/TestPage';
import SubmitPage from './pages/SubmitPage';
import UserPage from './pages/UserPage';
import EditTestPage from './pages/EditTestPage';
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
      <Routes>
        <Route
          path="/login"
          element={!auth ? <Login setAuth={setAuth} setRole={setRole} /> : <Navigate to={role === 'admin' ? "/admin" : "/student-home"} />}
        />
        <Route
          path="/signup"
          element={!auth ? <SignUp /> : <Navigate to={role === 'admin' ? "/admin" : "/student-home"} />}
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
          element={auth ? <TestPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/submit/:id"
          element={auth ? <SubmitPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/user"
          element={auth ? <UserPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-test/:id"
          element={auth ? (role === 'admin' ? <EditTestPage /> : <Navigate to="/student-home" />) : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={auth ? (role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/student-home" />) : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
