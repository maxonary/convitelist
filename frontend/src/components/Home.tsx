import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AxiosError } from 'axios';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.div`
  font-size: 2em;
  font-weight: bold;
`;

const StatusText = styled.div`
  font-size: 1.2em;
  text-align: center;
`;

const InputContainer = styled.div`
  margin-top: 20px;
`;

const Input = styled.input`
  font-size: 1em;
  padding: 10px;
  border: none;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  background-color: #008cba;
  color: white;
  cursor: pointer;
`;

const AdminButton = styled(Button)`
  position: absolute;
  top: 20px;
  right: 20px;
`;

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
    <PageContainer>
      <Title>Minecraft Server Status</Title>
      <InputContainer>
        <Input 
          type="text" 
          value={username} 
          onChange={handleInputChange} 
          placeholder="Enter Minecraft Username" 
        />
      </InputContainer>
      <ButtonContainer>
        <Button onClick={createUser}>Submit</Button>
        <Button style={{ display: 'none' }}>Dynmap</Button>
      </ButtonContainer>
      {errorMessage && <p>{errorMessage}</p>}
      <AdminButton onClick={handleAdminLogin}>Admin Login</AdminButton>
    </PageContainer>
  );
}

export default Home;
