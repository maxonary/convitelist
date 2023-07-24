import React from 'react';

interface InputFieldProps {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = (props) => (
  <input {...props} className={`input-field ${props.className}`}/>
);

export default InputField;
