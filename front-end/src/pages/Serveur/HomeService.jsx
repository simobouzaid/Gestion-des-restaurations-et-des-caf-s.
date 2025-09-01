import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Loading from './../../component/Loading';
document.title = 'home service'

const HomeService = () => {
  const nav = useNavigate()
  const [produits, setproduit] = useState([]);
  const [cmd, setCommande] = useState([]);
  const code = localStorage.getItem('codeSvr');
  const [loading, setLoagin] = useState(false)
  const [loadingCommade, setLoadingCommande] = useState(true);
  const logout = () => {
    localStorage.removeItem('codeSvr');
    nav('/LoginSvr')
  }
  //partie de produit
  const getProduit = async (type) => {
    setLoagin(true)
    const response = await axios.get(`/api/produits/${code}/${type}`)
    if (response.data.status) {
      setproduit(response.data.produits)
    }
    setLoagin(false)
  }


  // partie de commande

  const commander = async (id) => {
    setLoadingCommande(true)
    const response = await axios.post('/api/Commande', {
      id: id, code: code
    })
    setLoadingCommande(false)
    console.log(response.data)

  }


  useEffect(() => {

    const getCommand = async () => {
      const response = await axios.post('/api/getCommande', {
        code: code
      });

      if(!response.data.length == 0){

        setCommande(response.data)
      }
      setLoadingCommande(false)

    }
    getCommand();
  }, [loading, code, loadingCommade])


  const suprimmerCommand = async (idProduit) => {
    setLoadingCommande(true)
    const response = await axios.delete(`/api/Commande/${idProduit}/${code}`)
    setLoadingCommande(false)
    console.log(response.data)
  }


  if (localStorage.getItem('codeSvr') === '') {
    nav('/LoginSvr')
  }
  return (
    <>
      <div className='flex h-screen'>

        <div className='w-1/2'>
          <h2 className='text-center text-2xl p-2 m-2'>les commands</h2>
          {cmd.length !== 0 ?

            <button className='bg-emerald-600 text-xl text-white px-3 py-1 rounded-xl ml-2'> valider la commande</button> :
                          <p className='mt-50 text-center'> aucun commande </p>

          }
          <div className='flex flex-wrap  justify-around '>


            {loadingCommade ? <Loading /> :
              cmd.map((cmd, index) => (


                <div
                  className='m-2 border-2 w-1/5 grid '
                  key={index}
                >
                  <img
                    className='w-40'
                    src={`http://127.0.0.1:8000${cmd.get_product.image_url}`}
                    alt={`Produit ${index + 1}`}
                  />
                  <h2> le nom : {cmd.get_product.name}</h2>
                  <h2> le prix : {cmd.get_product.prix} dh</h2>
                  <h2> le type : {cmd.get_product.type} </h2>
                  <h2> le total : {cmd.total} </h2>
                  <button className='bg-red-700 px-4 py-1 text-white rounded-full ' onClick={() => suprimmerCommand(cmd.produit_id)}>suprimmer</button>
                </div>



              ))

            }

         

          </div>
        </div>
        <div className='border-3 w-1/2'>
          <h2 className='text-center text-2xl p-2 m-2'>les produits</h2>
          <div className='flex justify-around '>

            <button className='bg-blue-700 px-4 py-1 text-white rounded-full ' onClick={() => getProduit('tacos')}>tacos</button>
            <button className='bg-blue-700 px-4 py-1 text-white rounded-full' onClick={() => getProduit('pizza')}>pizza</button>
            <button className='bg-blue-700 px-4 py-1 text-white rounded-full' onClick={() => getProduit('the')}>the</button>
            <button className='bg-blue-700 px-4 py-1 text-white rounded-full' onClick={() => getProduit('caffe')}>caffe</button>
            <button className='bg-blue-700 px-4 py-1 text-white rounded-full' onClick={() => getProduit('boisson')}>boisson</button>
            <button className='bg-blue-700 px-4 py-1 text-white rounded-full' onClick={() => getProduit('autre')}>autre</button>
            <button className='bg-red-700 px-4 py-1 text-white rounded-full' onClick={logout}>deconnection</button>
          </div>
          {loading ? <Loading props={''} /> :
            <div className='flex flex-row '>

              {produits ?

                produits.map((produit, index) => (
                  <div
                    className='m-2 border-2 w-1/4 grid'
                    key={index}
                  >
                    <img
                      className='w-40'
                      src={`http://127.0.0.1:8000${produit.image_url}`}
                      alt={`Produit ${index + 1}`}
                    />
                    <h2> le nom : {produit.name}</h2>
                    <h2> le prix : {produit.prix} dh</h2>
                    <button className='bg-emerald-700 px-4 py-1 text-white rounded-full' onClick={() => commander(produit.id)}> commander </button>
                  </div>

                ))
                : <p> aucun  type de produit ajouter ...</p>}

              {produits.length === 0 && (

                <h2 className='text-center mt-30 px-40'>aucune produit dans cette type de produit</h2>
              )
              }
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default HomeService;