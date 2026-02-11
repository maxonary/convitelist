import React, { useState, useRef, useEffect } from "react";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { copyToClipboard } from "../utils/clipboardUtils";
import UserTable from "./UserTable";
import Button from "./Button";
import { apiJwt, setAuthToken, api, apiStatus } from "../api";
import "../styles/Minecraft.css";
import TitleImage from "./TitleImage";

function Dashboard() {
  const signOut = useSignOut();
  const navigate = useNavigate();
  
  // Get token from localStorage (react-auth-kit stores it when authType is "localstorage")
  useEffect(() => {
    try {
      const stored = localStorage.getItem('__auth__');
      if (stored) {
        const authData = JSON.parse(stored);
        if (authData.token) {
          setAuthToken(authData.token);
          console.log('[Dashboard] Token loaded from localStorage');
        }
      }
    } catch {
      // If parsing fails, try reading as plain string
      const token = localStorage.getItem('__auth__');
      if (token) {
        setAuthToken(token);
        console.log('[Dashboard] Token loaded from localStorage (plain)');
      }
    }
  }, []);

  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<string>("");

  const invitationCodeRef = useRef<HTMLInputElement>(null);

  // Function to fetch server status
  const fetchServerStatus = () => {
    // Try backend API status endpoint first, fallback to direct status service
    api.get('/api/status')
      .then(response => setServerStatus(response.data.status))
      .catch(() => {
        // Fallback to direct status service if backend proxy is unavailable
        if (process.env.REACT_APP_STATUS_API_URL) {
          apiStatus.get('/status')
            .then(response => setServerStatus(response.data.status))
            .catch(() => {
              setServerStatus("Error fetching status");
            });
        } else {
          setServerStatus("Error fetching status");
        }
      });
  };

  const startClick = () => {
    console.log('WakeUp');
    // Try backend API wakeup endpoint first, fallback to direct status service
    api.post('/api/status/wakeup', {})
      .then((response) => { 
        console.log('WakeUp Success', response);
        // Update status immediately after wake-up attempt
        fetchServerStatus();
      })
      .catch(() => {
        // Fallback to direct status service if backend proxy is unavailable
        if (process.env.REACT_APP_STATUS_API_URL) {
          apiStatus.post('/wakeup', {})
            .then((response) => { 
              console.log('WakeUp Success (direct)', response);
              // Update status immediately after wake-up attempt
              fetchServerStatus();
            })
            .catch((error) => { 
              console.log('WakeUp Error', error); 
            });
        } else {
          console.log('WakeUp Error: No status service URL configured');
        }
      });
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

  const generateCode = async () => {
    try {
      const response = await apiJwt.post("/api/invitation/generate-invitation-code");
      const generatedCode = response.data.code;
      setInvitationCode(generatedCode);
      copyToClipboard(generatedCode); 
      setIsCopied(false);
      setError(null); 
    } catch (err) {
      console.error(err);
      setError("Failed to generate invitation code. Please try again.");
    }
  };

  const handleCopyToClipboard = () => {
    if (invitationCode) {
      copyToClipboard(invitationCode);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  };

  const logout = () => {
    signOut();
    navigate("/admin/login");
  }

  useEffect(() => {
    const url = window.location.host;
    document.title = `Admin Dashboard - ${url}`;
    
    // Fetch status immediately
    fetchServerStatus();
    
    // Set up polling to fetch status every 5 seconds
    const statusInterval = setInterval(() => {
      fetchServerStatus();
    }, 5000); // Poll every 5 seconds
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(statusInterval);
    };
  }, []);  

  return (
    <div className="container">
      <TitleImage src="/dashboard.png" alt="Dashboard"/>
      <UserTable />
      <br />
      <div className="menu-dashboard">
        {error && <div className="error">{error}</div>}
        {invitationCode && (
          <div className="standard-text">
            Generated Invitation Code - Click to Copy:{" "}
            <input
              className="link-text"
              ref={invitationCodeRef}
              type="text"
              value={invitationCode}
              readOnly
              onClick={handleCopyToClipboard}
            />
          </div>
        )}
        <button className="item full server-status-btn" onClick={serverStatus === "Error fetching status" ? undefined : startClick}>
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
        <div className="double">
          <Button className="item" onClick={generateCode} type="button">
            <div className="title">
              {isCopied ? "Code Copied" : "Get Invitation Code"}
            </div>
          </Button>
          <Button className="item" onClick={logout} type="button">
            <div className="title">
              Logout
            </div>
          </Button>
        </div>
        {serverStatusLink && (
          <div className="item full lang">
            <a className="standard-text title" href={serverStatusLink} target="_blank" rel="noopener noreferrer">
              {getTexts(serverStatus).emoji}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
