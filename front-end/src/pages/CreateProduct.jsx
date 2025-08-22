import axios from 'axios';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';

const CreateProduct = () => {
  const nameRef = useRef();
  const prixRef = useRef();
  const fileRef = useRef();
  const nav = useNavigate()

  document.title = 'cree un produit'

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', nameRef.current?.value || '');
    formData.append('prix', prixRef.current?.value || '');

    const file = fileRef.current?.files[0];
    if (file) {
      formData.append('image', file);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Non connecté');
      return;
    }

    try {

      await axios.get('/sanctum/csrf-cookie');


      await axios.post('/api/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Obligatoire
          'Authorization': `Bearer ${token}`,
        },
      });



      nav('/product')
      e.target.reset();
    } catch (error) {
      if (error.response) {
        console.error('Erreur 422 :', error.response.data);
        const errors = error.response.data.errors;
        if (errors) {
          Object.keys(errors).forEach(key => {
            alert(`${key}: ${errors[key][0]}`);
          });
        }
      } else {
        console.error('Erreur réseau :', error);
        alert('Erreur réseau');
      }
    }
  };

  return (
   <div className="flex flex-col m-6 p-8 w-96 mx-auto bg-white rounded-xl shadow-lg border-t-4 border-blue-600">
  <h1 className="text-center text-2xl font-semibold text-blue-700 mb-6">Créer un produit</h1>
  <form onSubmit={handleSubmit} className="space-y-4">
   
    <input
      type="text"
      placeholder="Nom"
      ref={nameRef}
      required
      className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-700"
    />


    <input
      type="number"
      step="0.01"
      placeholder="Prix"
      ref={prixRef}
      required
      className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-700"
    />

    <input
      type="file"
      accept="image/*"
      ref={fileRef}
      className="w-full p-2 border border-dashed border-blue-400 rounded-lg text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
    />


    <button
      type="submit"
      className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 transform hover:scale-105"
    >
      Créer
    </button>
  </form>
</div>

  );
};

export default CreateProduct;