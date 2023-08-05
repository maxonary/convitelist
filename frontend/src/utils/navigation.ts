import { NavigateFunction } from 'react-router-dom';

export const navigateBackOrHome = (navigate: NavigateFunction) => {
  if (window.history.length > 1) {
    navigate(-1); // Go back to previous page
  } else {
    navigate('/');
  }
};
