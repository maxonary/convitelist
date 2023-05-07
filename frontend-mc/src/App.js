import React, { useState } from 'react';
import axios from 'axios';
import Admin from './Admin';
import './App.css';

// env var BACKEND_API_URL is set in .env file
const apiUrl = process.env.REACT_APP_BACKEND_API_URL;

function App() {
  const [username, setUsername] = useState('');
  const [minecraftUsername, setMinecraftUsername] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(`${apiUrl}/users`, {
        username,
        minecraftUsername,
      });
      setSuccess(true);
    } catch (err) {
      setError('Error registering user.');
    }
  };

  return (
    <div className="App">
      <Admin />
      <h1>Minecraft Server Registration</h1>
      {success ? (
        <p>Registration successful! Please wait for approval.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Minecraft Username:
              <input
                type="text"
                value={minecraftUsername}
                onChange={(e) => setMinecraftUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Register</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
