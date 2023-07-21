import React, { useState, useEffect } from 'react';
import { Button } from "baseui/button";
import { useSignIn, useIsAuthenticated } from "react-auth-kit";
import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import api from '../api';
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

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: {username: string, password: string}) => {
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
      
      if (error?.response) setError(error.response.data.message);
      else if (error?.message) setError(error.message);
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
        <div className="mc-menu">
          <div className="mc-input-wrapper full">
            <input 
              name="username"
              type="text" 
              className="mc-input full" 
              placeholder="Enter Email"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
          </div>
          <div className="mc-input-wrapper full">
            <input 
              name="password"
              type="password" 
              className="mc-input full" 
              placeholder="Enter Password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </div>
          <Button className="mc-button full" type="submit">Login</Button>
          <div className="double">
            <div className="mc-button full">
              <div className="title">Admin Login</div>
            </div>
            <div className="mc-button full">
              <a style={{ textDecoration: 'none' }} href="/admin/login" target="_blank" rel="noreferrer">
                <div className="title">Server Status</div>
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
