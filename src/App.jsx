import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import LeaderLayout from './layouts/LeaderLayout';

// Public Pages
import Scoreboard from './pages/public/Scoreboard';
import PublicWorkshops from './pages/public/Workshops';

// Auth Pages
import AdminLogin from './pages/auth/AdminLogin';
import MemberLogin from './pages/auth/MemberLogin';
import MemberRegister from './pages/auth/MemberRegister';

// Admin Pages
import Events from './pages/admin/Events';
import CreateEvent from './pages/admin/CreateEvent';
import Teams from './pages/admin/Teams';
import Members from './pages/admin/Members';
import AdminWorkshops from './pages/admin/Workshops';
import TimerControl from './pages/admin/TimerControl';

// Leader Pages
import MyTeam from './pages/leader/MyTeam';
import SelectMembers from './pages/leader/SelectMembers';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const RootLayout = ({ children }) => (
  <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: '1' }}>
      {children}
    </main>
    <Footer />
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Or forbidden page
  }
  return children;
};

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  
  if (user?.role === 'admin') return <Navigate to="/admin" />;
  if (user?.role === 'leader') return <Navigate to="/leader/team" />;
  
  return <Scoreboard />;
};

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<MemberLogin />} />
          <Route path="/register" element={<MemberRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Public Routes */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/workshops" element={<PublicWorkshops />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Events />} />
            <Route path="events/create" element={<CreateEvent />} />
            <Route path="teams" element={<Teams />} />
            <Route path="members" element={<Members />} />
            <Route path="workshops" element={<AdminWorkshops />} />
            <Route path="timer" element={<TimerControl />} />
          </Route>

          {/* Leader Routes */}
          <Route path="/leader" element={
            <ProtectedRoute allowedRoles={['leader']}>
              <LeaderLayout />
            </ProtectedRoute>
          }>
            <Route path="team" element={<MyTeam />} />
            <Route path="select-members" element={<SelectMembers />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}


export default App;
