// import React, { useEffect, useState } from 'react';
// import UserService, { User } from '../UserService';

// const Dashboard: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);

//   useEffect(() => {
//     UserService.getAll().then(response => setUsers(response.data));
//   }, []);

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       {users.map(user => (
//         <div key={user.id}>
//           <h2>{user.minecraftUsername}</h2>
//           <p>{user.approved ? 'Approved' : 'Not Approved'}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;

import axios from "axios";
import { Button } from "baseui/button";
import { HeadingXXLarge } from "baseui/typography";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { Container } from "./commons";

function Home() {
  const singOut = useSignOut();
  const navigate = useNavigate();

  const logout = () => {
    singOut();
    navigate("/login");
  };

  const getPayment = async () => {
    const response = await axios.get("http://localhost:9000/api/v1/payment", {
      withCredentials: true,
    });
    console.log("Response: ", response);
  };

  return (
    <Container>
      <HeadingXXLarge color="secondary500">Welcome Home Bud!</HeadingXXLarge>
      <Button kind="secondary" onClick={getPayment}>
        Get Payment
      </Button>
      <Button kind="secondary" onClick={logout}>
        Logout
      </Button>
    </Container>
  );
}

export default Home;