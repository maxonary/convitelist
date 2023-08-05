import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api';
import InputField from './InputField';
import Button from './Button';
import BackButton from './BackButton';

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

  const [blinkingField, setBlinkingField] = useState('username');
  const fieldsOrder = ['username', 'password', 'email', 'invitationCode'];

  const handleInputChange = (fieldName: any, value: any) => {
    setBlinkingField(fieldName);
    formik.setFieldValue(fieldName, value);
    const nextFieldIndex = fieldsOrder.indexOf(fieldName) + 1;
    if (nextFieldIndex < fieldsOrder.length) {
      setBlinkingField(fieldsOrder[nextFieldIndex]);
    }
  };

  const onSubmit = async (values: any) => {
    setError('');

    try {
      await api.post('/admin/register', values);

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
    <div className="container">
      <form onSubmit={formik.handleSubmit}>
        <div className="menu-register">
          <div className="item">
            <InputField
              name="username"
              type="text"
              className={`title ${blinkingField === 'username' ? 'blinking' : ''}`}
              placeholder="Enter Username"
              value={formik.values.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
            {formik.touched.username && formik.errors.username && <span className="error-message">{formik.errors.username}</span>}
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
            {formik.touched.password && formik.errors.password && <span className="error-message">{formik.errors.password}</span>}
          </div>
          <div className="item">
            <InputField
              name="email"
              type="email"
              className={`title ${blinkingField === 'email' ? 'blinking' : ''}`}
              placeholder="Enter Email"
              value={formik.values.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            {formik.touched.email && formik.errors.email && <span className="error-message">{formik.errors.email}</span>}
          </div>
          <div className="item">
            <InputField
              name="invitationCode"
              type="text"
              className={`title ${blinkingField === 'invitationCode' ? 'blinking' : ''}`}
              placeholder="Enter Invitation Code"
              value={formik.values.invitationCode}
              onChange={(e) => handleInputChange('invitationCode', e.target.value)}
            />
            {formik.touched.invitationCode && formik.errors.invitationCode && <span className="error-message">{formik.errors.invitationCode}</span>}
          </div>
          <div onClick={() => navigate("/admin/login")} className="center-link">
            Already have an account? Login here
          </div>
          <div className="double">
            <Button className="item" type="submit">
              <div className="title">
                {error ? <span className="error-message">{error}</span> : 'Register'}
              </div>
            </Button>
            <BackButton className="item">
              <div className="title">
                Back
              </div>
            </BackButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
