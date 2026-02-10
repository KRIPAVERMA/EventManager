import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="app-layout">
      <Navbar />
      <main className={`main-content ${isAdminPage ? 'admin-layout' : ''}`}>
        <Outlet />
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default Layout;
