import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from your routing library
import { navigateBackOrHome } from '../utils/navigation';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigateBackOrHome(navigate);
  };

  return (
    <Button className={className} onClick={handleButtonClick}>
      <div className="title">
        Back
      </div>
    </Button>
  );
};

export default BackButton;
