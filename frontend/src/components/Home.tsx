import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { isAxiosError } from '../utils/isAxiosError';
import { isValidUsername } from '../utils/isValidUsername';
import { isAndroid, isIOS } from 'react-device-detect';
import { api, apiStatus } from '../api';
import '../styles/Minecraft.css';
import TitleImage from './TitleImage';
import SplashText from './SplashText';

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
    } else if (!isValidUsername(username, gameType)) {
      setErrorMessage("Pleaser enter a valid username");
      return;
    } else if (gameType === "") {
      setErrorMessage("Please select a game type");
      return;
    }

    try {
      await api.post('/api/user', { minecraftUsername: username, gameType: gameType });

      setErrorMessage("");
      setUsername("");
      setGameType("");
      setSuccessMessage("Success");
      openApp()
  
    } catch (error) {
      setSuccessMessage("");
      if (isAxiosError(error)) {
        if (error.response) {
          handleAxiosError(error);
        }
      }
    }
  };

  useEffect(() => {
    const url = window.location.host;
    document.title = `Add to Whitelist - ${url}`;
    apiStatus.get('/status')
      .then(response => setServerStatus(response.data.status))
      .catch(() => {
        // Port 5000 service (Minecraft server status) is optional
        setServerStatus("Status service unavailable");
      });
  }, []);  

  const startClick = () => {
      console.log('WakeUp');
      apiStatus.post('/wakeup', {})
          .then((response) => { 
            console.log('WakeUp Sucess', response);
            openApp();
           })
          .catch((error) => { 
            console.log('WakeUp Error', error); 
          })
  };

  const getTexts = (status: string) => {
      let emoji = '❌'
      let buttonText = status;
      switch (status) {
          case 'Running':
              emoji = '🟩'
              buttonText = 'Server is running'
              break;
          case 'Sleeping':
              emoji = '🟥'
              buttonText = "Wake Up Server"
              break;
          case 'Starting':
              emoji = '🟧'
              buttonText = '...Waiting...'
              break;
      }
      return { emoji, buttonText };
  };

  const serverStatusLink = process.env.REACT_APP_SERVER_STATUS_URL;

  const serverName = process.env.REACT_APP_SERVER_NAME;
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const serverPort = process.env.REACT_APP_SERVER_PORT;

  const openApp = () => {  
    if (isIOS) {
      // Open iOS app
      window.location.replace(`minecraft://?addExternalServer=${serverName}|${serverIp}:${serverPort}`);
      // Redirect to App Store if app is not installed
      setTimeout(() => {
        window.location.replace("https://apps.apple.com/de/app/minecraft/id479516143");
      }, 10000);
    } else if (isAndroid) {
      // Open Android app
      window.location.replace(`intent://play/#Intent;scheme=minecraft;package=com.mojang.minecraftpe;end`);
      // Redirect to Play Store if app is not installed
      setTimeout(() => {
        window.location.replace("https://play.google.com/store/apps/details?id=com.mojang.minecraftpe");
      }, 10000);
    }
  };
  
return (
    <div className="container">
      <TitleImage src="/whitelist.png" alt="Whitelist" style={{marginBottom: "20px", cursor: "default"}}/>
      <SplashText />
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
            <button className="item full" onClick={serverStatus === "Error fetching status" ? openApp : startClick}>
              <div className="title">
                {serverStatus === "Error fetching status" ? (
                  "Error fetching status"
                ) : (
                  <div className="standard-text">
                    {getTexts(serverStatus).buttonText}
                  </div>
                )}
              </div>
            </button>
            <button className="item full" onClick={() => navigate("/admin/login")}>
              <div className="title">Admin Login</div>
            </button>
          </div>
          <div className="item full lang">
          <button className="title">
            <a className="standard-text" href={serverStatusLink} target="_blank" rel="noopener noreferrer">
                {getTexts(serverStatus).emoji}
            </a>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;