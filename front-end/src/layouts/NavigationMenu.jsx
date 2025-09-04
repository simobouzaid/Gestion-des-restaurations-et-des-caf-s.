import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const NavigationMenu = () => {
    const [style ,setStyle] = useState("")
    useEffect(()=>{

        setStyle('hover:bg-blue-400 text-xl px-5 transition duration-300 hover:rounded-xl rounded-xl ')
    },[])
    return (
        <>
            <ul className="bg-blue-500 flex justify-around p-3">
                <li  className={style}><Link to={'/'}>home</Link></li>
                <li className={style}><Link to={'/Comand'}>Commande</Link></li>
                <li className={style}><Link to={'/product'}>produit</Link></li>
                <li className={style}><Link to={'/Server'}>Serveur</Link></li>
                <li className={style}><Link to={'/deconnection'}>Deconexion</Link></li>
            </ul>
        </>
    );
};

export default NavigationMenu;