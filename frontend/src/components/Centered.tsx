import React, { ReactNode } from 'react';

interface CenteredProps {
  children: ReactNode;
}

const Centered = ({children}: CenteredProps) => {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      {children}
    </div>
  );
};

export default Centered;