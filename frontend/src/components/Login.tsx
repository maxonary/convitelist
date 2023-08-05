import React, { useState, useEffect } from 'react';
import { useSignIn, useIsAuthenticated } from "react-auth-kit";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import api from '../api';
import InputField from './InputField';
import Button from './Button';
import BackButton from './BackButton';
import '../styles/Minecraft.css';

interface ErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
  message?: string;
}

function Login() {
  const [error, setError] = useState("");
  const signIn = useSignIn();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const [blinkingField, setBlinkingField] = useState('username');
  const fieldsOrder = ['username', 'password'];

  const handleInputChange = (fieldName: any, value: any) => {
    setBlinkingField(fieldName);
    formik.setFieldValue(fieldName, value);
    const nextFieldIndex = fieldsOrder.indexOf(fieldName) + 1;
    if (nextFieldIndex < fieldsOrder.length) {
      setBlinkingField(fieldsOrder[nextFieldIndex]);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: {
    username: string, 
    password: string
  }) => {
    setError("");

    try {
      const response = await api.post('/auth/login', values);

      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { username: values.username },
      });

      navigate("/admin/dashboard");
      
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      
      if (error?.response) {
        setError(error.response.data.message);
      } else if (error?.message) {
        setError(error.message);
      } else {
        setError("Unable to login");
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit,
  });

  return (
    <div className="container">
      <form onSubmit={formik.handleSubmit}>
        <div className="menu">
          <div className="item">
            <InputField
              name="username"
              type="text" 
              className={`title ${blinkingField === 'username' ? 'blinking' : ''}`}
              placeholder="Enter Username"
              value={formik.values.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
          </div>
          <div className="item">
            <InputField
              name="password"
              type="password" 
              className={`title ${blinkingField === 'password' ? 'blinking' : ''}`}
              placeholder="Enter Password"
              value={formik.values.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>
          <div onClick={() => navigate("/admin/register")} className="center-link">
            Don't have an account? Register here
          </div>
            <div className="double">
              <Button className="item" type="submit">
                <div className="title"> 
                {error ? <span className='error-message'>{error}</span> : "Login"}
                </div>
              </Button>
              <BackButton className="item" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
