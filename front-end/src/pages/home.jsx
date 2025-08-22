import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../component/Loading';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';

const Home = () => {

  const navigate = useNavigate();
  const token=localStorage.getItem('token')
             document.title='home'

    if (!token) {
      navigate('/login');
    }

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found, user is not logged in');
          return;
        }

      

        const response = await axios.get('/api/user', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true,
        });

        setUser(response.data);
        console.log('User data:', response.data);
      } catch (error) {
        console.error('Error fetching user:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          console.log('Token expired or invalid, removed from storage');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        await axios.post('/api/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      }
      
      localStorage.removeItem('token');
      setUser(null);
      console.log('Logged out successfully');
navigate('/login')

    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  if (loading) {return ( <Loading props={'Chargement des produits... '}/>);}

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Home</h2>

      {user ? (
        <div>
          <p>
            <strong>Welcome:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button 
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p className="text-red-500">You are not logged in.</p>
          <a href="/login" className="text-blue-500 underline">Go to Login</a>
        </div>
      )}
    </div>
  );
};

export default Home;