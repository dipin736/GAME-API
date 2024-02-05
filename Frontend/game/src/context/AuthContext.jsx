import React, { createContext, useContext, useState } from 'react';
import api from '../service/api';
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify';




const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    });
  
    const login = async (userData) => {
      try {
        const response = await api.post('token/', {
          username: userData.username,
          password: userData.password,
        });
    
        const token = response.data.access;
        console.log('Received Token:', token);
    
        if (!token) {
          throw new Error('Token not found in response');
        }

        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
    
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          id: decodedToken.user_id,  
          username: userData.username,
        }));
    
        setUser({
          id: decodedToken.user_id,  
          username: userData.username,
        });
      } catch (error) {
        console.error('Error during login:', error);
    
        if (error.response && error.response.status === 401) {
          toast.error('Invalid username or password. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
          })
          
        } else {
          alert('An error occurred during login. Please try again later.');
        }
    
        throw new Error('Login failed');
      }
    };
    
  const register = async (userData) => {
    try {
      await api.post('register/', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });
    } catch (error) {
      console.error('Error during registration:', error);
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logout Successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  console.log('User in useAuth:', context.user);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export { AuthProvider, useAuth };
