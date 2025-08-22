
import { Outlet } from 'react-router-dom';
import NavigationMenu from './navigationMenu';

const Layout = () => {
    return (
        <>
            <header>
              <NavigationMenu />
          
            </header>
            <main>
                <Outlet />
            </main>
            <footer></footer>


        </>
    );
};

export default Layout;