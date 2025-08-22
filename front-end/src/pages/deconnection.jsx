import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Configuration d'axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';

const Deconnection = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      
      const token = localStorage.getItem('token');

      if (token) {
        // Appel API pour invalider le token (optionnel avec Sanctum)
        await axios.post(
          '/api/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Supprimer le token
      localStorage.removeItem('token');
      console.log('Déconnecté avec succès');

      // Rediriger vers la page de login
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };
  handleLogout()
  return (
    <div>  
      
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Deconnection...</p>
          </div>
          </div>
          
      
    </div>
  );
};

export default Deconnection;