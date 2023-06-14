// import React, { useState, FormEvent } from 'react';
// import AuthService, { LoginData } from '../AuthService';

// const Login: React.FC = () => {
//   const [formData, setFormData] = useState<LoginData>({ username: '', password: '' });

//   const handleSubmit = (event: FormEvent) => {
//     event.preventDefault();
//     AuthService.login(formData).then(response => {
//       console.log(response.data);
//       // Save the JWT token and redirect the user to the dashboard
//     });
//   };

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [event.target.name]: event.target.value });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
//       <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Login;

// Taken from react-easy-auth

import { Button } from "baseui/button";
import { Input } from "baseui/input";
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

import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(props: any) {
  const [error, setError] = useState("");
  const signIn = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    console.log("Values: ", values);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        values
      );

      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { username: values.username },
      }); {
        navigate("/");
      }
      
    } catch (err) {
      if (err && err instanceof AxiosError)
        setError(err.response?.data.message);
      else if (err && err instanceof Error) setError(err.message);

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