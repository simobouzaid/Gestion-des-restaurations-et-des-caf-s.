import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../component/Loading';
import axios from 'axios'
function ServeurUpdate() {
    const { id } = useParams()
    const nav = useNavigate()
    const [serveur, setServeur] = useState({
        nameServeur: '', code: ''
    })
    const [loading, setl] = useState(true);
    const token = localStorage.getItem('token')
    if (!token) {
        nav('/login')
    }

    useEffect(() => {
        const show = async () => {

            const r = await axios.get(`/api/serveur/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )
            setl(false)
            setServeur({
                nameServeur: r.data.serveur[0].name, code: r.data.serveur[0].code
            })
        }

        show()
    },[])
    const handlSubmit = async (e) => {
       setl(true)
        e.preventDefault()
        console.log(serveur.nameServeur, '', serveur.code)
         await axios.put(`/api/serveur/${id}`, {
            name: serveur.nameServeur,
            code: serveur.code
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
       setl(false)
       alert('le mise ajour avec success')
      
    }




    if (loading) {
        return <Loading props={'mise a jour le serveur'} />
    }

    return (
       <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md space-y-4">
  <h2 className="text-xl font-semibold text-gray-800">Mise à jour du serveur</h2>

  <form 
    onSubmit={handlSubmit} 
    className="flex flex-wrap items-center gap-4 w-full max-w-3xl"
  >
    
    <input
      type="text"
      value={serveur.nameServeur}
      onChange={(e) => setServeur({ ...serveur, nameServeur: e.target.value })}
      placeholder="Nom du serveur"
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-grow min-w-48"
    />


    <input
      type="number"
      value={serveur.code}
      onChange={(e) => setServeur({ ...serveur, code: e.target.value })}
      placeholder="Code du serveur"
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-36"
    />


    <button
      type="submit"
      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
    >
      Mettre à jour
    </button>
  </form>
</div>
    );
};

export default ServeurUpdate;