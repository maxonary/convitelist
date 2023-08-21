import { NavigateFunction } from 'react-router-dom';

export const navigateBackOrHome = (navigate: NavigateFunction) => {
  // Get the current location from the window's location object
  const currentPath = window.location.pathname;

  // Check if there is a previous page in the history stack
  if (window.history.length > 1) {
    const previousPath = window.location.href; // Get the URL of the previous page
    if (previousPath !== currentPath) {
      navigate(-1); // Go back to previous page
    } else {
      navigate('/'); // Redirect to the homepage if previous page is the same as current page
    }
  } else {
    navigate('/'); // Redirect to the homepage if there's no previous page
  }
};
