import api from "../api";
import { useSignOut } from "react-auth-kit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "./commons";
import UserTable from "./UserTable";
import InputField from './InputField';
import Button from './Button';
import "../styles/Minecraft.css"

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
      <h1>Welcome Home Bud!</h1>
      <div className="">
        <UserTable />

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
        {invitationCode && (
            <div>
            {`Generated Invitation Code: ${invitationCode}`}
          </div>
          )}
      </div>
    </Container>
  );
}

export default Home;