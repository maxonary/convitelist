import React, { MouseEventHandler } from 'react';

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className, type = 'button' }) => (
  <button
    type={type}
    className={className}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
