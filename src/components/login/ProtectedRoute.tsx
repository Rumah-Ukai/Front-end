// src/routes/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ---------------------
// Helper functions
// ---------------------
const getToken = () => localStorage.getItem('token');
const getTokenExpiration = () => localStorage.getItem('tokenExpiration');

const checkAuth = async (): Promise<boolean> => {
  const token = getToken();
  const tokenExpiration = getTokenExpiration();

  if (!token || !tokenExpiration || Date.now() >= parseInt(tokenExpiration)) {
    return false;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch (err) {
    console.error('Auth check failed:', err);
    return false;
  }
};

// ---------------------
// ProtectedRoute component
// ---------------------
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const auth = await checkAuth();
      if (!auth) navigate('/login', { replace: true });
      setLoading(false);
    };
    verify();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
