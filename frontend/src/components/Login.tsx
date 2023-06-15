import React, { useState, useEffect } from 'react';
import { Button } from "baseui/button";

import styled from "styled-components";
import {
  HeadingXXLarge,
  HeadingXLarge,
  HeadingLarge,
  HeadingMedium,
  HeadingSmall,
  HeadingXSmall,
} from "baseui/typography";
import {
  Container,
  ErrorText,
  InnerContainer,
  InputWrapper,
  StyledInput,
} from "./commons";

import { useSignIn, useIsAuthenticated } from "react-auth-kit";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import api from '../api';

const RedirectButton = styled(Button)`
  position: absolute;
  top: 20px;
  right: 20px;
`;

function Login(props: any) {
  const [error, setError] = useState("");
  const signIn = useSignIn();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: any) => {
    console.log("Values: ", values);
    setError("");

    interface ErrorResponse {
      response?: {
        data: {
          message: string;
        };
      };
      message?: string;
    }

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
      
      if (error && error.response) 
        setError(error.response.data.message);
      else if (error && error.message) 
        setError(error.message);
    
      console.log("Error: ", err);
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
    <Container>
      <InnerContainer>
        <form onSubmit={formik.handleSubmit}>
          <HeadingXXLarge>Welcome Back!</HeadingXXLarge>
          <ErrorText>{error}</ErrorText>
          <InputWrapper>
            <StyledInput
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              placeholder="Username"
              clearOnEscape
              size="large"
              type="text"
            />
          </InputWrapper>
          <InputWrapper>
            <StyledInput
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Password"
              clearOnEscape
              size="large"
              type="password"
            />
          </InputWrapper>
          <InputWrapper>
            <Button size="large" kind="primary" isLoading={formik.isSubmitting}>
              Login
            </Button>
          </InputWrapper>
        </form>
      </InnerContainer>
    </Container>
  );
}

export default Login;
