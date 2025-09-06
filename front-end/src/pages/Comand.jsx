import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Loading from '../component/Loading';
document.title = 'les commandes'

const Comand = () => {

    const [commands, setCommands] = useState([])
    const [commandsAll, setCommandsAll] = useState([])
    const [loadin, setLoadin] = useState(false)
    const [suppression, setSuppression] = useState(null);
    const token = localStorage.getItem('token');
    const nameServeur =useRef()
    const searchCommandServeur=()=>{
        const value =nameServeur.current.value.toLowerCase()
     if ((nameServeur.current.value).length === 0) {
      setCommands(commandsAll)
    } else {
   
        let command = commandsAll.filter((item) => {
            return item.get_serveur.name.toLowerCase().includes(value);
            });
            setCommands(command);
    }
        
    }
   
    useEffect(() => {
        const getCommande = async () => {
            try {
                // setLoadin(true)
                const response = await axios.get('/api/commande', {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                }) 


                setCommands(response.data)
                setCommandsAll(response.data)
            } catch (error) {
                console.log(error.response)
            } finally {
                setLoadin(false)
            }


        }
        getCommande()

    }, [token,suppression])


    const handelSubmit = async(idCommand) => {

        setSuppression(idCommand)
          const response = await axios.delete(`/api/commande/${idCommand}`, {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                })

 setSuppression(null)
console.log(response.data)

    }

    return (
        <>

            <h3 className='text-center text-2xl mb-5'>les commandes </h3>
            <div className='flex flex-col items-center'>
         <h4>recheche</h4>
         <div className='flex flex-row px-2'>

             <input type="text" placeholder='le nom de produit'  className='border-blue-100 border-5 px-5 mb-3 text-xl text-center' onChange={searchCommandServeur} ref={nameServeur} />
         </div>


                <table className="border-2 w-full table-auto">
                    <thead className="border-2 bg-gray-200">
                        <tr>
                            <th className="border px-4 py-2">Le nom de produit</th>
                            <th className="border px-4 py-2">Le prix</th>
                            <th className="border px-4 py-2">La date de commandes</th>
                            <th className="border px-4 py-2">Le nom de serveur</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {loadin ? (
                            <tr>
                                <td colSpan={6} className="flex justify-center items-center py-4">
                                    <Loading props={'charger les commandes'} />
                                </td>
                            </tr>)
                            : (
                                commands.map((command) => (

                                    <tr>
                                        <td className="border px-4 py-2 text-center"> {command.get_product.name}</td>
                                        <td className="border px-4 py-2 text-center">{command.get_product.prix} DH</td>
                                        <td className="border px-4 py-2 text-center">{new Date(command.created_at).getDate().toString().padStart(2, '0')}/{(new Date(command.created_at).getMonth() + 1).toString().padStart(2, '0')}/{new Date(command.created_at).getFullYear().toString().padStart(2, '0')} ||
                                            {new Date(command.created_at).getUTCHours().toString().padStart(2, '0')}:{new Date(command.created_at).getMinutes().toString().padStart(2, '0')}:{new Date(command.created_at).getSeconds().toString().padStart(2, '0')}</td>
                                        <td className="border px-4 py-2 text-center">{command.get_serveur.name}</td>
                                        <td className="border px-4 py-2 text-center">{command.status}</td>
                                        <td className="border px-4 py-2 flex flex-col text-center ">
                                            <button onClick={() => handelSubmit(command.id)} disabled={suppression === command.id}
                                                className={`flex-1 ${suppression === command.id
                                                    ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-500'
                                                    : 'bg-red-600 hover:bg-red-700'
                                                    } text-white py-2 px-3  text-sm font-medium  rounded shadow-xl hover:shadow-3xl hover:bg-red-700 transition duration-200 transform hover:scale-110`}
                                            >
                                                {suppression === command.id ? 'Suppression...' : 'Supprimer'}</button>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>






            </div>


        </>
    );
};

export default Comand;