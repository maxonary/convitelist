import React, { useState, useRef } from "react";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { Container } from "./commons";
import UserTable from "./UserTable";
import Button from "./Button";
import api from "../api";
import "../styles/Minecraft.css";

function Dashboard() {
  const signOut = useSignOut();
  const navigate = useNavigate();

  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invitationCodeRef = useRef<HTMLInputElement>(null);

  const generateCode = async () => {
    try {
      const response = await api.post("/invitation/generate-invitation-code");
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

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }).catch((error) => {
      console.error("Failed to copy to clipboard:", error);
    });
  };

  const handleCopyToClipboard = () => {
    if (invitationCode) {
      copyToClipboard(invitationCode);
    }
  };

  const logout = () => {
    signOut();
    navigate("/admin/login");
  }

  return (
    <Container>
      <h1>Admin Dashboard</h1>
      <br />
      <UserTable />
      <br />
      <div className="menu-dashboard">
        {error && <div className="error">{error}</div>}
        {invitationCode && (
          <div className="standard-text">
            Generated Invitation Code to register new Users:{" "}
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
      </div>
    </Container>
  );
}

export default Dashboard;
