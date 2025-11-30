import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../api';
import InputField from './InputField';
import Button from './Button';
import BackButton from './BackButton';
import TitleImage from './TitleImage';

const initialValues = {
  username: '',
  password: '',
  email: '',
  invitationCode: '',
};

const getValidationSchema = (isFirstAdmin: boolean) => Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  invitationCode: isFirstAdmin 
    ? Yup.string() 
    : Yup.string().required('Invitation code is required'),
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
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [blinkingField, setBlinkingField] = useState('username');
  const fieldsOrder = isFirstAdmin 
    ? ['username', 'password', 'email']
    : ['username', 'password', 'email', 'invitationCode'];

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await api.get('/api/admin/check');
        setIsFirstAdmin(response.data.isFirstAdmin);
      } catch (err) {
        console.error('Error checking admin status:', err);
        // Default to requiring invitation code if check fails
        setIsFirstAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

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
      // Only include invitationCode if it's not the first admin
      const payload = isFirstAdmin 
        ? { username: values.username, password: values.password, email: values.email }
        : values;

      await api.post('/api/admin/register', payload);

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
    validationSchema: getValidationSchema(isFirstAdmin),
    onSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    const url = window.location.host;
    document.title = `Admin Registration - ${url}`;
  }, []);  

  if (loading) {
    return (
      <div className="container">
        <TitleImage src='/register.png' alt='Title' />
        <div className="menu-register">
          <div className="item">
            <div className="title">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <TitleImage src='/register.png' alt='Title' />
      <form onSubmit={formik.handleSubmit}>
        <div className="menu-register">
          {isFirstAdmin && (
            <div className="item" style={{ marginBottom: '10px', textAlign: 'center' }}>
              <div className="title" style={{ fontSize: '0.9em', color: '#4CAF50' }}>
                🎉 Creating first admin account - No invitation code needed!
              </div>
            </div>
          )}
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
              placeholder="Enter Password (min. 8 characters)"
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
          {!isFirstAdmin && (
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
          )}
          <div onClick={() => navigate("/admin/login")} className="link-text">
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
