import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AxiosError } from 'axios';
import '../styles/Minecraft.css';

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
    <div className="mc-menu">
      <div className="mc-button full">
        <div className="title">Singleplayer</div>
      </div>
      <div className="mc-button full">
        <div className="title">Multiplayer</div>
      </div>
      <div className="mc-button full">
        <div className="title">Minecraft Realms</div>
      </div>
      <div className="double">
        <div className="mc-button full">
          <div className="title">Options</div>
        </div>
        <div className="mc-button full">
          <div className="title">Quit Game</div>
        </div>
      </div>
      <div className="mc-button full lang">
        <div className="title">
          <img src="https://i.ibb.co/99187Lk/lang.png" alt=" Lang"/>
        </div>
      </div>
    </div>
  );
}

//   return (
//     <div className="mc-menu">
//       <div className="Title">Minecraft Server Whitelist</div>
//       <div className="InputContainer">
//         <input
//           className="Input mc-button"
//           type="text"
//           value={username}
//           onChange={handleInputChange}
//           placeholder="Enter Minecraft Username"
//         />
//       </div>
//       <div className="ButtonContainer">
//         <button className="mc-button" onClick={createUser}>Submit</button>
//         <button className="mc-button" style={{ display: 'none' }}>Dynmap</button>
//       </div>
//       {errorMessage && <p>{errorMessage}</p>}
//       <button className="mc-button" onClick={handleAdminLogin}>Admin Login</button>
//     </div>
//   );
// }

export default Home;
