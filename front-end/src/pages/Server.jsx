import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loading from '../component/Loading';
import { Link } from "react-router-dom";
document.title = 'les serveurs'
const Server = () => {
    const token = localStorage.getItem('token');
    const [serveur, setServeur] = useState([])
    const [loading, setl] = useState(true);

const SupprimerServeur =async(id)=>{
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
            setl(true)
            const getServeur = async () => {

                let res = await axios.get('/api/serveur', {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                });
               
                setServeur(res.data.serveurs)
            }
            getServeur() 
            setl(false)
           
        } catch (error) {
            console.log(error)
        } finally {
            setl(false)
        }

    }, [token,loading])




    if (loading) {
        return  (<Loading props={'charger les donnes'} />);

        
    }

    return (<>
  {/* Titre principal */}
  <h3 className="text-center text-3xl font-semibold text-gray-800 p-8">
    Les serveurs
  </h3>

  {/* Bouton pour ajouter un serveur */}
  <Link
    to="/createServeur"
    className="inline-block bg-blue-600 text-lg text-white px-4 py-2 rounded-md 
               hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:ring-offset-2 transition duration-200 mx-auto mb-6"
  >
    Ajouter un serveur
  </Link>

  {/* Message si aucun serveur */}
  {serveur.length === 0 ? (
    <p className="text-center text-gray-500 mt-4">Aucun serveur disponible.</p>
  ) : (
    /* Liste des serveurs */
    <div className="mt-4 space-y-3 px-4">
      {serveur.map((srv) => (
        <div
          key={srv.id}
          className="flex flex-wrap items-center justify-between 
                     border border-gray-300 rounded-lg bg-white p-4 shadow-sm 
                     hover:shadow transition-shadow duration-200"
        >
          {/* Informations du serveur */}
          <div className="flex-1 min-w-32 mb-2 sm:mb-0">
            <h4 className="text-gray-800"><span className="font-medium">Nom :</span> {srv.name}</h4>
            <h4 className="text-gray-600"><span className="font-medium">Code :</span> {srv.code}</h4>
          </div>

          {/* Actions : Modifier et Supprimer */}
          <div className="flex space-x-2 flex-shrink-0">
            <Link
              to={`/updateServeur/${srv.id}`}
              className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded 
                         hover:bg-blue-700 focus:outline-none focus:ring"
            >
              Modifier
            </Link>
            <button
              type="button"
              onClick={() => SupprimerServeur(srv.id)}
              className="bg-orange-700 text-white text-sm px-3 py-1.5 rounded 
                         hover:bg-orange-800 focus:outline-none focus:ring"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</>
);
};

export default Server;