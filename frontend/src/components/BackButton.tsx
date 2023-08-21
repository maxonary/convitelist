import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from your routing library
import { navigateBackOrHome } from '../utils/navigationUtils';

interface BackButtonProps {
  className?: string;
  children: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ className, children }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigateBackOrHome(navigate);
  };

  return (
    <Button className={className} onClick={handleButtonClick}>
      {children}
    </Button>
  );
};

export default BackButton;
