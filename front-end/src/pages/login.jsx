import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';

const Login = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const nav = useNavigate();
        document.title='login'

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value.trim();

        try {

            const rs = await axios.post('/api/login', { email, password });
            
            if (rs.status == 200 || rs.status == 204) {
                if (rs.data.status) {
                    nav('/');
                    localStorage.setItem('token', rs.data.access_token)
                }
                if (!rs.data.status) {
                    setError(true)
                }
            }
        } catch (err) {
            setError(err.response.data || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

//     if (loading) {
//   return(
          
//           <div className=" mt-40 flex justify-center items-center h-64">
//           <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
//           <p>login...</p>
//           </div>
//           </div>
          
//         )  
//     }

    return (<>
  
          

        <div className="  max-w-md mx-auto mt-40 p-6 bg-white rounded-lg shadow-md">
            <h2 className="  text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
            {error == true &&(
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error} </div>
            )}
            <form className="  space-y-4" onSubmit={handleLogin}>
                <div>
                    <input className='text-xl border-2 p-3 w-100' type="email" id="email" ref={emailRef} required placeholder='Email' value={'simo@gmail.com'} />
                </div>
                <div>
                    <input className='text-xl border-2 p-3 w-100' type="password" id="password" ref={passwordRef} required placeholder='Password' value={'123456789'} />
                </div>
                <div className='flex justify-center'>

                    <button className='flex justify-center bg-blue-600 px-10 py-2 text-2xl text-blue-50 rounded-full hover:bg-blue-500 hover:text-blue-200 transition-all duration-200' type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            <Link to={'/LoginSvr'} className='text-center '> login  serveur </Link>
            </form>
        </div>
    </>
    );
};

export default Login;
