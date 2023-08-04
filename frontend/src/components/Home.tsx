import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { isAxiosError } from '../utils/isAxiosError';
import { isValidUsername } from '../utils/isValidUsername';
import api from '../api';
import '../styles/Minecraft.css';

const Home = () => {
  const [username, setUsername] = useState("");
  const [gameType, setGameType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setSuccessMessage("");  // reset the success message
  };

  const toggleGameType = () => {
    setGameType(prevGameType => prevGameType === "" || prevGameType === "Bedrock Edition" ? "Java Edition" : "Bedrock Edition");
    setSuccessMessage("");  // reset the success message
  }

  const handleAxiosError = (error: AxiosError) => {
    if (error.response) {
      const responseData = error.response.data as { message: string };
      setErrorMessage(responseData.message);
    } else if (error.request) {
      setErrorMessage('Unable to make request to backend');
    } else {
      setErrorMessage(error.message);
    }
  };

  const createUser = async () => {
    if (username === "") {
      setErrorMessage("Please enter a username");
      return;
    } else if (!isValidUsername(username)) {
      setErrorMessage("Pleaser enter a valid username");
      return;
    } else if (gameType === "") {
      setErrorMessage("Please select a game type");
      return;
    }

    try {
      await api.post('/user', { minecraftUsername: username, gameType: gameType });

      setErrorMessage("");
      setUsername("");
      setGameType("");
      setSuccessMessage("Success");
  
    } catch (error) {
      setSuccessMessage("");
      if (isAxiosError(error)) {
        if (error.response) {
          handleAxiosError(error);

        }
      }
    }
  };

  return (
    <div className="container">
        <div className="menu">
          <div className="item full">
            <input 
              type="text" 
              className="title blinking" 
              placeholder="Enter Minecraft Username"
              value={username}
              onChange={handleInputChange}
            />
          </div>
          <button className="item full" onClick={toggleGameType}>
            <div className="title">{gameType === "" ? "Select Game Type" : gameType}</div>
          </button>
          <button className="item full" onClick={createUser}>
            <div className="title">
              {successMessage ? 
                  <span className='success-message'>{successMessage}</span> 
                : errorMessage ? 
                  <span className='error-message'>{errorMessage}</span> 
                : "Submit to Whitelist"
              }
            </div>
          </button>
          <div className="double">
            <button className="item full">
              <a className="title" href="http://localhost:3000" target="_blank" rel="noreferrer">
                Server Status
              </a>
            </button>
            <button className="item full" onClick={() => navigate("/admin/login")}>
              <div className="title">Admin Login</div>
            </button>
          </div>
          <div className="item full lang">
            <div className="title">
              <img src="https://i.ibb.co/99187Lk/lang.png" alt=" Lang"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
