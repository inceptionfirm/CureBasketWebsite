import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setError } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Try API login first
      try {
        const response = await apiService.login(formData);
        
        if (response.success && response.data) {
          setUser(response.data.user);
          // Redirect to profile page
          navigate('/account');
          return;
        } else {
          setErrorMessage(response.error || response.message || 'Login failed. Please check your credentials.');
        }
      } catch (apiError) {
        console.warn('API login failed:', apiError);
        
        // Check if it's a network/CORS error vs authentication error
        if (apiError.message && apiError.message.includes('Failed to fetch')) {
          // Network error - allow demo mode for development
          console.warn('Network error detected, using demo mode for development');
          const demoUser = {
            id: 'demo-1',
            email: formData.email,
            name: formData.email.split('@')[0],
            firstName: formData.email.split('@')[0],
            lastName: 'User',
            role: 'customer',
            createdAt: new Date().toISOString()
          };
          
          setUser(demoUser);
          localStorage.setItem('user', JSON.stringify(demoUser));
          localStorage.setItem('token', 'demo-token-' + Date.now());
          localStorage.setItem('flycanary_token', 'demo-token-' + Date.now());
          
          // Redirect to profile page
          navigate('/account');
          return;
        } else {
          // Authentication error
          setErrorMessage(apiError.message || 'Login failed. Please check your credentials.');
        }
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during login. Please try again.');
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@site.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/signup">Create an account</Link>
            </p>
            <p>
              <Link to="/forgot-password">Forgot your password?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

