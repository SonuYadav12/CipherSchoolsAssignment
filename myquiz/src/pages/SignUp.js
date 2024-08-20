import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CanvasBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    let particles = [];
    const colors = ['#a3d9ff', '#b4e1b6', '#f5a1a1', '#f3e1a1'];

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

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', { email, password, name, role });
      console.log('User registered:', res.data);
      toast.success('Registration successful!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Registration failed!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      <CanvasBackground />
      <div className="relative w-full max-w-md bg-white p-8 rounded-lg shadow-lg z-10 transform transition-transform duration-500 hover:scale-105">
        <ToastContainer />
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform duration-300 transform hover:scale-105"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform duration-300 transform hover:scale-105"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform duration-300 transform hover:scale-105"
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
                onChange={() => setRole('student')}
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
                onChange={() => setRole('admin')}
                className="form-radio"
              />
              <span className="text-gray-700">Admin</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-500 hover:underline">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
