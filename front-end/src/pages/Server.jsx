import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loading from '../component/Loading';
import { Link } from "react-router-dom";
document.title = 'les serveurs'
const Server = () => {
    const token = localStorage.getItem('token');
    const [serveur, setServeur] = useState([])
    const [loading, setl] = useState(true);

const SuprimmerServeur =async(id)=>{
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce serveur ?')) {
      return;
    }
    try {

        setl(true)
        await axios.delete(`api/serveur/${id}`,{
            headers:{
                 Authorization: `bearer ${token}`
            }
        })
        setl(false)
    } catch (error) {
        alert(error)
    }

}




    useEffect(() => {

        try {
            const getServeur = async () => {

                let res = await axios.get('/api/serveur', {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                });
               
                setServeur(res.data)
                setl(false)
            }
            getServeur() 
           
        } catch (error) {
            console.log(error)
        } finally {
            setl(false)
        }

    }, [token,loading])




    if (loading) {
        return (
            <>

                <Loading props={'charger les donnes'} />

            </>
        );
    }

    return (<>
        <h3 className='text-center p-8 text-3xl '>les serveurs</h3>
        <Link className='border bg-blue-600 text-1xl text-white p-2 hover:bg-blue-700' to='/createServeur' >ajouter un serveur</Link>
        {serveur.length === 0 && (
            <p className="text-center text-gray-500">Aucun serveur</p>
        )}

        {serveur.map((serveur) => (
            <div key={serveur.id} className='border w-200 mx-3 mt-2 flex justify-between '>

                <h4> le nom :{serveur.name}</h4>
                <h4> le code :{serveur.code}</h4>
                <Link className='mx-2 bg-blue-600 py-1 px-2 text-white hover:bg-blue-700 '>modifier</Link>
                <button className='mx-2 bg-orange-700  py-1 px-2 text-white hover:bg-orange-800' onClick={()=>SuprimmerServeur(serveur.id)} >suprimmer</button>
            </div>

        ))
        }
    </>
    );
};

export default Server;