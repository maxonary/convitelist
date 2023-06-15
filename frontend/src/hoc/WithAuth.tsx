import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsAuthenticated } from 'react-auth-kit';

const WithAuth = (WrappedComponent: React.ComponentType) => {
  const AuthWrapper = (props: any) => {
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    // useEffect(() => {
    //   if (!isAuthenticated()) {
    //     navigate('/login');
    //   }
    // }, [isAuthenticated, navigate]);

    if (isAuthenticated()) {
      return <WrappedComponent {...props} />;
    }
    
    return null;
  }

  return AuthWrapper;
}

export default WithAuth;
