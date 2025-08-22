import axios from 'axios';
import React, { useRef, useState } from 'react';
import Loading from '../component/Loading';
import { useNavigate } from 'react-router-dom';



function CreateServeur() {

    const refname = useRef();
    const refcode = useRef();
    const [loading, setl] = useState(false)
    const nav =useNavigate()
    const handelClick = async (e) => {
        setl(true)
        e.preventDefault()
        const name = refname.current.value.trim()
        const code = refcode.current.value.trim()
        const token = localStorage.getItem('token')
        if (name === '' || code === '') {
            alert('le code ou le nom et vite')

        }
        try {

            const res = await axios.post('api/serveur', {
                name: name,
                code: code
            },
                {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                })
            console.log(res.data)
            setl(false)
         nav('/Serveur')
        } catch (error) {
            alert(error)
        }finally{
            setl(false)
        }





    }
    if (loading) {
        return (

            <Loading props={'ajouter le serveur'} />
        )
    }




    return (
        <div className='flex '>

            <form action="" onSubmit={handelClick} className='mt-6 space-y-4 px-80 flex flex-col '>
                <h2 className='text-center text-xl'>ajouter un serveur</h2>
                <input type="text" placeholder='le nom et prenom ' ref={refname} className=' w-60 text-center p-3 border' />
                <input type="text" placeholder='code de serveur' ref={refcode} className='w-60 text-center p-3 border' />
                <input type="submit" className='text-xl bg-blue-600 text-white py-1 hover:bg-blue-800' value={'ajouter'} />


            </form>
        </div>
    );
};

export default CreateServeur;