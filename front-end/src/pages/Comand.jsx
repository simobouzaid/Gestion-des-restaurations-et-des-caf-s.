import axios from 'axios';
import React, { useEffect, useState } from 'react';
document.title = 'les commandes'

const Comand = () => {

    const [commands, setCommands] = useState([])
    const token = localStorage.getItem('token');
    useEffect(() => {
        const getCommande = async () => {
            try {

                const response = await axios.get('/api/commande', {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                })
                console.log(response.data)
                setCommands(response.data)
            } catch (error) {
                console.log(error.response)
            }


        }
        getCommande()

    }, [token])


    const handelSubmit = (idCommand) => {
        alert(idCommand)
    }

    return (
        <>

            <h3 className='text-center text-2xl mb-5'>les commandes </h3>
            <div className='flex flex-col items-center'>
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
                        {commands.map((command) => (

                            <tr>
                                <td className="border px-4 py-2 text-center"> {command.get_product.name}</td>
                                <td className="border px-4 py-2 text-center">{command.get_product.prix} DH</td>
                                <td className="border px-4 py-2 text-center">{new Date(command.created_at).getDate().toString().padStart(2, '0')}/{(new Date(command.created_at).getMonth() + 1).toString().padStart(2, '0')}/{new Date(command.created_at).getFullYear().toString().padStart(2, '0')} ||
                                    {new Date(command.created_at).getUTCHours().toString().padStart(2, '0')}:{new Date(command.created_at).getMinutes().toString().padStart(2, '0')}:{new Date(command.created_at).getSeconds().toString().padStart(2, '0')}</td>
                                <td className="border px-4 py-2 text-center">{command.get_serveur.name}</td>
                                <td className="border px-4 py-2 text-center">{command.status}</td>
                                <td className="border px-4 py-2 flex flex-col text-center ">
                                    <button className="bg-red-600 text-white px-3 py-1 rounded shadow-xl hover:shadow-3xl hover:bg-red-700 transition duration-200 transform hover:scale-110" onClick={() => handelSubmit(command.id)}>Supprimer</button>
                                </td>
                            </tr>
                        ))

                        }
                    </tbody>
                </table>






            </div>


        </>
    );
};

export default Comand;