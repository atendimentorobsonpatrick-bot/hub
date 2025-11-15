import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, openLoginModal } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      openLoginModal();
      navigate('/', { replace: true });
    }
  }, [user, openLoginModal, navigate]);

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
