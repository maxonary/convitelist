import React, { useEffect, useState } from "react";
import { useSignOut, useIsAuthenticated } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { Container } from "./commons";
import UserTable from "./UserTable";
import Button from "./Button";
import api from "../api";
import "../styles/Minecraft.css";

function Dashboard() {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const [invitationCode, setInvitationCode] = useState<string | null>(null);

  const generateCode = async () => {
    try {
      const response = await api.post("/invitation/generate-invitation-code");
      setInvitationCode(response.data.code);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    signOut();
    navigate("/admin/login");
  }

  return (
    <Container>
      <h1>Admin Dashboard</h1>

      <UserTable />
      
      <div className="menu-dashboard">
        {invitationCode && (
          <div>
            {`Generated Invitation Code: ${invitationCode}`}
          </div>
        )}
        <div className="double">
          <Button className="item" onClick={generateCode} type="button">
            <div className="title">
              Get Admin Invitation Code
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