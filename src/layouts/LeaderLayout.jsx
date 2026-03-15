import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const LeaderLayout = () => {
  return (
    <div className="layout-leader">
      <Navbar />
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
