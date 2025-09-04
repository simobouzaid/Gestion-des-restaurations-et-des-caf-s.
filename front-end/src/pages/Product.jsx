import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import CreateProduct from './CreateProduct';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const Product = () => {
  document.title = 'les produits'

  const [produits, setProduits] = useState([]);
  const nav = useNavigate()
  const [auth, setAuth] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suppression, setSuppression] = useState(null);

  const token = localStorage.getItem('token');
if (!token) {
          nav('/login')
}

  const getImageUrl = (produit) => {
    if (!produit.image_url) return null;

    if (produit.image_url.startsWith('http')) {
      return produit.image_url;
    }

    if (produit.image_url.startsWith('/storage')) {
      return `http://127.0.0.1:8000${produit.image_url}`;
    }

    return `http://127.0.0.1:8000/storage/${produit.image_url}`;
  };

  const supprimerProduit = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    setSuppression(id);

    try {
      const response = await axios.delete(`/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      console.log('Product deleted successfully:', response.data);

      // Update the product list without reloading
      setProduits(prevProduits =>
        prevProduits.filter(produit => produit.id !== id)
      );

      alert('Produit supprimé avec succès!');

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);

      let errorMessage = 'Erreur lors de la suppression du produit.';

      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        setAuth(error.response.status)
        if (error.response.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else if (error.response.status === 404) {
          errorMessage = 'Produit non trouvé.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Impossible de se connecter au serveur.';
      }

      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setSuppression(null);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      if (!token) {
        setError('Token d\'authentification introuvable');
        setLoading(false);

        return;
      }

      try {
        console.log('Fetching products...');


        const response = await axios.get('/api/product', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true,
        });

        console.log('Products fetched successfully:', response.data);

        response.data.forEach(produit => {
          console.log(`Product ${produit.id} image_url:`, produit.image_url);
          console.log(`Product ${produit.id} full URL:`, getImageUrl(produit));
        });
        console.log(response.data)
        setProduits(response.data);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setAuth(error.response.status)

        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);


          if (error.response.status === 401) {
            setError('Session expirée. Veuillez vous reconnecter.');
            // setAuth();

          } else if (error.response.status === 500) {
            setError(`Erreur serveur: ${error.response.data.message || 'Erreur interne du serveur'}`);
          } else {
            setError(`Erreur ${error.response.status}: ${error.response.data.message || 'Échec du chargement des produits'}`);
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('Impossible de se connecter au serveur. Vérifiez votre connexion.');
        } else {
          console.error('Request setup error:', error.message);
          setError('Erreur de configuration de la requête.');
        }
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [token]);

  const fermerErreur = () => {
    setError(null);
  };



  if (auth === 401) {
    nav('/login')
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={fermerErreur}
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Fermer</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
        <div className="mt-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Mes Produits</h3>
        <Link
          to="/create_product"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Ajouter un produit
        </Link>

      </div>

      {produits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Aucun produit trouvé</div>
          <Link
            to="/create_product"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Créer votre premier produit
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produits.map((produit) => {
            const imageUrl = getImageUrl(produit);

            return (
              <div
                key={produit.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-2xl transform hover:scale-110   transition-all duration-300 bg-white "
              >
                <div className="h-40 flex items-center justify-center bg-gray-100 mb-3 rounded">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={produit.name}
                      className="max-h-full max-w-full object-contain rounded"
                      onError={(e) => {
                        console.error('Image load error for:', imageUrl);
                        console.error('Original image_url:', produit.image_url);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', imageUrl);
                      }}
                    />
                  ) : null}
                  <div
                    className="text-gray-500 text-center"
                    style={{ display: imageUrl ? 'none' : 'block' }}
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Pas d'image</p>
                  </div>
                </div>

                <h4 className="font-semibold text-lg mb-2 text-gray-800 truncate" title={produit.name}>
                  {produit.name}
                </h4>
                <p className="text-gray-600 mb-4 text-lg font-medium">
                  Prix: <span className="text-orange-600">{produit.prix} DH</span>
                </p>

                <div className="flex gap-2">
                  {/* <Link
                    to={`/edit_product/${produit.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded transition-colors text-sm font-medium text-center"
                  >
                    Modifier
                  </Link> */}
                  <button
                    onClick={() => supprimerProduit(produit.id)}
                    disabled={suppression === produit.id}
                    className={`flex-1 ${suppression === produit.id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                      } text-white py-2 px-3 rounded transition-colors text-sm font-medium`}
                  >
                    {suppression === produit.id ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Product;