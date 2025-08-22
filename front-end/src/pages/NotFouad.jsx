import React from 'react';
import { Link } from 'react-router-dom';

const NotFouad = () => {

            document.title='  Not Fouad'

    return (
        <div className=' p-50 text-center'>
             <h3 className='text-4xl text-orange-600' >Not Faound</h3>
              <br /> 
              <Link to='/' className='text-3xl text-amber-300'>redirection a home page</Link>

        </div>
    );
};

export default NotFouad;