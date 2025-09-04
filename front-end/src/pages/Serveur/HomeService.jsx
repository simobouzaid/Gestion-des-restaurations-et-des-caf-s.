import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Loading from './../../component/Loading';
import Alert from '../../component/AlertSuccess';
document.title = 'home service'

const HomeService = () => {
  const nav = useNavigate()
  const [produits, setproduit] = useState([]);
  const [cmd, setCommande] = useState([]);
  const code = localStorage.getItem('codeSvr');
  const [loading, setLoagin] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [loadingCommade, setLoadingCommande] = useState(true);
  const logout = () => {
    localStorage.removeItem('codeSvr');
    localStorage.removeItem('tokenSvr');
    nav('/LoginSvr')
  }
  //partie de produit
  const getProduit = async (type) => {
    setLoagin(true)
    const response = await axios.get(`/api/produits/${code}/${type}`, {
      headers: {
        Authorization: localStorage.getItem('tokenSvr')
      }
    })
    if (response.data.status) {
      setproduit(response.data.produits)
      console.log(response.data);
    }



    // setShowAlert(true);
    // setTimeout(() => setShowAlert(false), 3000);
    setLoagin(false)
  }

  // partie de commande

  const commander = async (id) => {
    setLoadingCommande(true)
    const response = await axios.post('/api/Commande', {
      id: id, code: code
    }, {
      headers: {
        Authorization: localStorage.getItem('tokenSvr')
      }
    })
    setLoadingCommande(false)
    console.log(response.data)

  }
  const validerCommande = async () => {
    setLoadingCommande(true)
    const response = await axios.put('/api/validerCommande', { code: code }, {
      headers: {
        Authorization: localStorage.getItem('tokenSvr')
      }
    });
    console.log(response.data)
    if (!response.data.status) {
      alert('errore');
    }
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    setLoadingCommande(false)




  }


  useEffect(() => {

    const getCommand = async () => {
      // setLoadingCommande(true)
      const response = await axios.post('/api/getCommande', {
        code: code
      }, {
        headers: {
          Authorization: localStorage.getItem('tokenSvr')
        }
      });

      setCommande(response.data || []);
      setLoadingCommande(false)

    }
    getCommand();

  }, [loading, code, loadingCommade])

  const suprimmerCommand = async (idProduit) => {
    setLoadingCommande(true)
    const response = await axios.delete(`/api/Commande/${idProduit}/${code}`, {
      headers: {
        Authorization: localStorage.getItem('tokenSvr')
      }
    })

    console.log(response.data)
    setLoadingCommande(false)
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

            <button className='bg-emerald-600 text-xl text-white px-3 py-1 rounded-xl ml-2' onClick={validerCommande}> valider la commande</button> :
            <p className='mt-50 text-center'>


              {showAlert && (


                <Alert props={' ✅ la commande est valider'} color={'red'} />

              )}


              {loadingCommade == true ? ''
                :
                'aucun commande'


              }
            </p>

          }
          <div className='flex flex-wrap  justify-around '>

            {loadingCommade ? <Loading props={'chager les commandes '} /> :
              cmd.map((cmdItem, index) => (
                <div className='m-2 border-2 w-1/4 grid shadow-xl hover:shadow-2xl transform hover:scale-120 transition duration-300'
                  key={index}>

                  {!cmdItem.get_product ? (
                    <p>aucun produit</p>
                  ) : (
                    cmdItem.get_product.image_url ? (
                      <img
                        className='w-full h-30'
                        src={`http://127.0.0.1:8000${cmdItem.get_product.image_url}`}
                        alt={`Produit ${index + 1}`}
                      />
                    ) : (
                      <p>aucun photo</p>
                    )
                  )}
                  <div className='w-full h-full flex flex-col justify-end items-center'>

                    <h2> {cmdItem.get_product?.name || 'N/A'}</h2>
                    <h2> le prix : {cmdItem.get_product?.prix || 'N/A'} dh</h2>

                    <h2>total : {cmdItem.total}</h2>
                    <button
                      className='bg-red-700 px-4 py-1 text-white rounded-full'
                      onClick={() => suprimmerCommand(cmdItem.produit_id)}
                    >
                      suprimmer
                    </button>
                  </div>
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
          {loading ? <Loading props={'charger les produits'} /> :
            <div className='flex flex-row '>

              {produits ?

                produits.map((produit, index) => (
                  <div
                    className='m-2 border-2 w-1/4 grid shadow-xl hover:shadow-2xl transform hover:scale-120 transition duration-300'
                    key={index}
                  >
                    <img
                      className='w-full'
                      src={`http://127.0.0.1:8000${produit.image_url}`}
                      alt={`Produit ${index + 1}`}
                    />
                    <div className='w-full h-full flex flex-col justify-end items-center'>

                      <h2>  {produit.name}</h2>
                      <h2> le prix : {produit.prix} dh</h2>
                      <button className='bg-emerald-700 px-4 py-1 text-white rounded-full' onClick={() => commander(produit.id)}> commander </button>
                    </div>
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