import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const isAuthenticated = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');
  const tokenExpiration = localStorage.getItem('tokenExpiration');

  if (!token || !tokenExpiration || Date.now() >= parseInt(tokenExpiration)) {
    return false;
  }

  try {
    const response = await fetch('http://localhost:3000/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) navigate('/login');
      setIsCheckingAuth(false);
    };
    check();
  }, [navigate]);

  if (isCheckingAuth) return <div>Loading...</div>;
  return <>{children}</>;
};

export default ProtectedRoute;
