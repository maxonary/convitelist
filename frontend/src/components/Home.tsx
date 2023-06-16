import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AxiosError } from 'axios';
import '../styles/Home.css';

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};

const Home = () => {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  const createUser = async () => {
    try {
      const response = await api.post('/user', { minecraftUsername: username });

      setErrorMessage("");
      setUsername("");
  
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          const responseData = error.response.data as { message: string };
          setErrorMessage(responseData.message);
        } else if (error.request) {
          setErrorMessage('Unable to make request to server');
        } else {
          setErrorMessage(error.message);
        }
      }
    }
  };

  return (
    <div className="PageContainer">
      <div className="Title">Minecraft Server Whitelist</div>
      <div className="InputContainer">
        <input
          className="Input"
          type="text"
          value={username}
          onChange={handleInputChange}
          placeholder="Enter Minecraft Username"
        />
      </div>
      <div className="ButtonContainer">
        <button className="Button" onClick={createUser}>Submit</button>
        <button className="Button" style={{ display: 'none' }}>Dynmap</button>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
      <button className="AdminButton" onClick={handleAdminLogin}>Admin Login</button>
    </div>
  );
}

export default Home;
