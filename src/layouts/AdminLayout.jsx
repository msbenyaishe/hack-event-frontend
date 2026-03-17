import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  return (
    <div className="layout-admin">
      <div className="main-content">
        <Sidebar role="admin" />
        <main className="page-wrapper">
          <div className="container-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
