import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import AdminPage from './components/AdminPage'; 
import Unauthorized from './components/Unauthorized'; 
import RoleThemeWrapper from './styles/RoleThemeWrapper';
import SubmitDoc from './pages/SubmitDoc';
import ReviewDocs from './pages/ReviewDocs';
import {useEthereum} from './hooks/useEthereum';

function App() {
  const { provider, signer, contract } = useEthereum();

  useEffect(() => {
    if (provider && signer && contract) {
      toast.success(" Ethereum connected");
      console.log("Ethereum initialized successfully");

      // Optional: check network
      const checkNetwork = async () => {
        const network = await provider.getNetwork();
        console.log("Connected to:", network.name);
      };
      checkNetwork();
    } else {
      toast.error(" Ethereum not available");
      console.error("Ethereum initialization failed");
    }
  }, [provider, signer, contract]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleThemeWrapper>
                <Dashboard />
              </RoleThemeWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <RoleThemeWrapper>
                  <AdminPage />
                </RoleThemeWrapper>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['uploader']}>
                <RoleThemeWrapper>
                  <SubmitDoc />
                </RoleThemeWrapper>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/review-submissions"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['reviewer']}>
                <RoleThemeWrapper>
                  <ReviewDocs />
                </RoleThemeWrapper>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
    </Router>
  );
}

export default App;
