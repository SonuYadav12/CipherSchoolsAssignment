import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CanvasBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    let particles = [];
    const colors = ['#ff6b6b', '#f5f5f5', '#2f8f2f', '#7f5af0'];

    const createParticle = (x, y) => {
      return {
        x,
        y,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const generateParticles = () => {
      for (let i = 0; i < 100; i++) {
        particles.push(createParticle(Math.random() * width, Math.random() * height));
      }
    };

    const updateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x > width || particle.x < 0) particle.speedX *= -1;
        if (particle.y > height || particle.y < 0) particle.speedY *= -1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      requestAnimationFrame(updateParticles);
    };

    generateParticles();
    updateParticles();

    return () => {
      canvas.width = 0;
      canvas.height = 0;
    };
  }, []);

  return <canvas id="backgroundCanvas" className="absolute inset-0 z-0" />;
};

const Login = ({ setAuth, setRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRoleState] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let colorIndex = 0;
    const colors = ['#ff6b6b', '#f5f5f5', '#2f8f2f', '#7f5af0'];
    const body = document.body;
    
    const changeBackgroundColor = () => {
      body.style.transition = 'background-color 3s ease';
      body.style.backgroundColor = colors[colorIndex];
      colorIndex = (colorIndex + 1) % colors.length;
    };

    changeBackgroundColor();
    const interval = setInterval(changeBackgroundColor, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password, role });
      localStorage.setItem('token', res.data.token);
      setAuth(true);
      setRole(role); 
      navigate(role === 'admin' ? '/admin' : '/student-home');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <CanvasBackground />
      <div className="relative w-full max-w-lg bg-white p-8 rounded-lg shadow-lg z-10 transform transition-transform duration-500 hover:scale-105">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 transform hover:scale-105"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 transform hover:scale-105"
              required
            />
          </div>
          <div className="flex items-center space-x-6 mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === 'student'}
                onChange={() => setRoleState('student')}
                className="form-radio"
              />
              <span className="text-gray-700">Student</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={() => setRoleState('admin')}
                className="form-radio"
              />
              <span className="text-gray-700">Admin</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
          >
            Login
          </button>
          <div className="mt-6 text-center">
            <Link to="/signup" className="text-blue-400 hover:underline">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
