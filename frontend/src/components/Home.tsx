import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { isAxiosError } from '../utils/isAxiosError';
import { isValidUsername } from '../utils/isValidUsername';
import api from '../api';
import statusApi from '../statusApi';
import '../styles/Minecraft.css';

const Home = () => {
  const [username, setUsername] = useState("");
  const [gameType, setGameType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [serverStatus, setServerStatus] = useState("");
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
      const response = await api.post('/user', { minecraftUsername: username, gameType: gameType });

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

  // useEffect(() => {
  //   const fetchServerStatus = async () => {
  //     try {
  //       const response = await statusApi.get('/status');
  //       setServerStatus(response.data.status);
  //     } catch (error) {
  //       setServerStatus("Error fetching server status");
  //     }
  //   };
  //   fetchServerStatus();
  // }, []);

  useEffect(() => {
    statusApi.get('/status')
      .then(response => setServerStatus(response.data.status))
      .catch(error => console.error(error));
  }, []);


  const startClick = () => {
      console.log('WakeUp');
      statusApi.post('/wakeup', {})
          .then((response) => { console.log('WakeUp Sucess', response); })
          .catch((error) => { console.log('WakeUp Error', error); })
  };

  const getTexts = (status: string) => {
      let emoji = '🟥'
      let buttonText = status;
      switch (status) {
          case 'Running':
              emoji = '🟩'
              buttonText = 'Sleep'
              break;
          case 'Sleeping':
              emoji = '💤'
              buttonText = "Wake Up"
              break;
          case 'Starting':
              emoji = '🟧'
              buttonText = '...Waiting...'
              break;
      }
      return { emoji, buttonText };
  };

return (
    <div className="container">
        <div className="menu">
          <div className="item full">
            <input 
              type="text" 
              className="title blinking-placeholder" 
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
            <button className="item full" onClick={startClick}>
              <div className="title" >{getTexts(serverStatus).buttonText}</div>
            </button>
            <button className="item full" onClick={() => navigate("/admin/login")}>
              <div className="title">Admin Login</div>
            </button>
          </div>
          <div className="item full lang">
            <div className="title">
              <a className="emoji" href="http://localhost:3000">{getTexts(serverStatus).emoji}</a>
              {/* <img src="https://i.ibb.co/99187Lk/lang.png" alt=" Lang"/> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
