import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../component/Loading";
import { Link, Navigate } from "react-router-dom";

document.title = "Les serveurs";

const Server = () => {
  const token = localStorage.getItem("token");
  const [serveurs, setServeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Supprimer serveur
  const SupprimerServeur = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce serveur ?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/serveur/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // refresh list après suppression
      setServeurs((prev) => prev.filter((srv) => srv.id !== id));
    } catch (error) {
      if (error.response?.status === 401) {
        setAuthError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger serveurs
  useEffect(() => {
    const getServeurs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/serveur", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServeurs(res.data.serveurs || []);
      } catch (error) {
        if (error.response?.status === 401) {
          setAuthError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      getServeurs();
    } else {
      setAuthError(true);
    }
  }, [token]);

  // Redirection si pas authentifié
  if (authError) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <Loading props="Chargement des données..." />;
  }

  return (
    <div className="px-6 py-8">
      {/* Titre principal */}
      <h3 className="text-center text-3xl font-semibold text-gray-800 mb-8">
        Les serveurs
      </h3>

      {/* Bouton pour ajouter */}
      <div className="flex justify-end mb-6">
        <Link
          to="/createServeur"
          className="bg-blue-600 text-lg text-white px-4 py-2 rounded-lg 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 transition duration-200"
        >
          ➕ Ajouter un serveur
        </Link>
      </div>

      {/* Liste serveurs */}
      {serveurs.length === 0 ? (
        <p className="text-center text-gray-500">
          Aucun serveur trouvé. Ajoutez-en un !
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
          {serveurs.map((srv) => (
            <div
              key={srv.id}
              className="flex flex-col justify-between border border-gray-200 
                         rounded-xl bg-white p-4 shadow hover:shadow-lg 
                         transition duration-400
                         transform hover:scale-120
                         
                         "
            >
              <div>
                <h4 className="text-gray-800 font-semibold text-lg">
                  {srv.name}
                </h4>
                <p className="text-gray-600">
                  <span className="font-medium">Code :</span> {srv.code}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/updateServeur/${srv.id}`}
                  className="flex-1 bg-blue-600 text-white text-sm px-3 py-1.5 rounded 
                             hover:bg-blue-700 transition"
                >
                  Modifier
                </Link>
                <button
                  type="button"
                  onClick={() => SupprimerServeur(srv.id)}
                  className="flex-1 bg-red-600 text-white text-sm px-3 py-1.5 rounded 
                             hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Server;
