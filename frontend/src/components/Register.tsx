import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api';
import { HeadingXXLarge } from 'baseui/typography';
import { Button } from 'baseui/button';
import { Input } from 'baseui/input';
import { Container, InnerContainer, ErrorText, InputWrapper } from './commons';

const RegisterLink = styled(Link)`
  margin-top: 20px;
  display: block;
  text-align: center;
`;

const StyledInput = styled(Input)`
  width: 100%;
`;

const initialValues = {
  username: '',
  password: '',
  email: '',
  invitationCode: '',
};

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  invitationCode: Yup.string().required('Invitation code is required'),
});

interface ErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
}

function Register() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    setError('');

    try {
      const response = await api.post('/admin/register', values);

      // Reset form and show success message
      formik.resetForm();
      navigate('/admin/login');
    } catch (err: unknown) {
      const errorResponse = err as ErrorResponse;

      if (errorResponse && errorResponse.response) {
        setError(errorResponse.response.data.message);
      } else {
        setError('Error registering user');
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Container>
      <InnerContainer>
        <form onSubmit={formik.handleSubmit}>
          <HeadingXXLarge>Register</HeadingXXLarge>
          <ErrorText>{error}</ErrorText>
          <InputWrapper>
            <StyledInput
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Username"
              clearOnEscape
              size="large"
              type="text"
            />
            {formik.touched.username && formik.errors.username && <ErrorText>{formik.errors.username}</ErrorText>}
          </InputWrapper>
          <InputWrapper>
            <StyledInput
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Password"
              clearOnEscape
              size="large"
              type="password"
            />
            {formik.touched.password && formik.errors.password && <ErrorText>{formik.errors.password}</ErrorText>}
          </InputWrapper>
          <InputWrapper>
            <StyledInput
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Email"
              clearOnEscape
              size="large"
              type="email"
            />
            {formik.touched.email && formik.errors.email && <ErrorText>{formik.errors.email}</ErrorText>}
          </InputWrapper>
          <InputWrapper>
            <StyledInput
              name="invitationCode"
              value={formik.values.invitationCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Invitation Code"
              clearOnEscape
              size="large"
              type="text"
            />
            {formik.touched.invitationCode && formik.errors.invitationCode && (
              <ErrorText>{formik.errors.invitationCode}</ErrorText>
            )}
          </InputWrapper>
          <InputWrapper>
            <Button size="large" kind="primary" type="submit" isLoading={formik.isSubmitting}>
              Register
            </Button>
          </InputWrapper>
          <RegisterLink to="/admin/login">Already have an account? Login here</RegisterLink>
        </form>
      </InnerContainer>
    </Container>
  );
}

export default Register;