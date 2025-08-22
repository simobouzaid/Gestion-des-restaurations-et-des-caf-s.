import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/login';
import Sinup from '../pages/sinup';
import Layout from './../layouts/Layout';
import NotFouad from './../pages/NotFouad';
import Home from './../pages/home';
import Comand from './../pages/Comand';
import Server from './../pages/Server';
import CreateProduct from './../pages/CreateProduct';
import Product from './../pages/Product';
import Deconnection from './../pages/deconnection';
import ProductUpdate from './../component/productUpdate';
import CreateServeur from './../component/CreateServeur';
import ServeurUpdate from '../component/ServeurUpdate';



export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/create_product',
                element: <CreateProduct />
            }, 
           {
                path:'*',
                element:<NotFouad/>
            },{
                path:'/',
                element:<Home/>
            },{
                path:'/Comand',
                element:<Comand/>
            }
           
            ,{
                path:'/Server',
                element:<Server/>
            }
            ,{
                path:'/product',
                element:<Product/>
            }
            ,{
                path:'/productUpdate/:id',
                element:<ProductUpdate/>
            },{
                path:'/createServeur',
                element:<CreateServeur/>
            },{
                path:'/updateServeur/:id',
                element:<ServeurUpdate/>
            }
        ]
    } ,{
        path: '/login',
        element: <Login />
    }, {
        path: '/sinup',
        element: <Sinup />

    }
    , {
        path: '/deconnection',
        element: <Deconnection />

    }


]);