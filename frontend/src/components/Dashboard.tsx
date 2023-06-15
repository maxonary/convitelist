import api from "../api";
import axios from "axios";
import { Button } from "baseui/button";
import { HeadingXXLarge } from "baseui/typography";
import { Notification } from "baseui/notification";
import { useSignOut } from "react-auth-kit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "./commons";

function Home() {
  const signOut = useSignOut();
  const navigate = useNavigate();

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
      <HeadingXXLarge color="secondary500">Welcome Home Bud!</HeadingXXLarge>
      <Button kind="secondary" onClick={generateCode}>
        Get Admin Invitation Code
      </Button>
      {invitationCode && (
        <Notification>
        {`Generated Invitation Code: ${invitationCode}`}
      </Notification>
      )}
      <Button kind="secondary" onClick={logout}>
        Logout
      </Button>
    </Container>
  );
}

export default Home;