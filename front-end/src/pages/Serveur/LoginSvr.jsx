import React, { useRef, useState } from 'react';
import Loading from './../../component/Loading';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
document.title= 'login serveur'

const LoginSvr = () => {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const nav =useNavigate()
    const code = useRef()
    
    const handlSubmit =async (e) => {
        e.preventDefault();
        const codeSvr = code.current.value
        if (codeSvr.trim().length === 0) {
            setError(' le champs est vite')
        }
       if (codeSvr.trim().length !== 0) {
        setLoading(true)
        try {
            
            
            const response = await axios.post('/api/loginSvr',{
                code:codeSvr
            }); 
            
            if(response.data.status){          
                 localStorage.setItem('tokenSvr',response.data.tokenSvr)
                 localStorage.setItem('idSvr',response.data.serveur.id)
                 localStorage.setItem('nameSvr',response.data.serveur.name)
            nav('/HomeService')
            }else{
                setError(response.data.msg);
            }
        } catch (error) {
            setError(error)
        }finally{
            setLoading(false)
        }


       }




    }
    if (loading) {
        return (
            <>
                <Loading props={'login ....'} />
            </>
        )
    }


    return (
        <div className='flex justify-center flex-col m-10'>
            <h3 className='text-center text-2xl'>login serveur</h3>
            <form action="" className='flex flex-col m-5 px-100' onSubmit={handlSubmit}>
                {error && <p className='text-red-600 text-center '>
                    {error}
                </p>}
                <input type="password" placeholder='code de serveur' className={error ? 'text-center border-2 m-3 text-xl p-3 border-red-600' : 'text-center border-2 m-3 text-xl p-3 '} ref={code} />
                <input type="submit" className='bg-blue-600 text-white p-2 hover:bg-blue-700 transition duration-200 rounded-xl hover:rounded-3xl' />
                <Link to={'/login'} className='text-center m-3 hover:text-xl hover:text-blue-400'> login Admin</Link>
            </form>
        </div>
    );
};

export default LoginSvr;