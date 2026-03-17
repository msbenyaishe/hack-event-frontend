import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const LeaderLayout = () => {
  return (
    <div className="layout-leader">
      <div className="main-content">
        <Sidebar role="leader" />
        <main className="page-wrapper">
          <div className="container-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaderLayout;
