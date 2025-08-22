import { Link } from "react-router-dom";


const NavigationMenu = () => {
    return (
        <>
            <ul className="bg-blue-500 flex justify-around p-3">
                <li  className="hover:bg-blue-400"><Link to={'/'}>home</Link></li>
                <li className="hover:bg-blue-400"><Link to={'/Comand'}>Command</Link></li>
                <li className="hover:bg-blue-400"><Link to={'/product'}>product</Link></li>
                <li className="hover:bg-blue-400"><Link to={'/Server'}>Serveurs</Link></li>
                <li className="hover:bg-blue-400"><Link to={'/deconnection'}>Deconexion</Link></li>
            </ul>
        </>
    );
};

export default NavigationMenu;