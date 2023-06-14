import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  minecraftUsername: string;
  approved: boolean;
}

interface UserDetailProps {
  userId: number;
}

const UserDetail: React.FC<UserDetailProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Detail</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Minecraft Username:</strong> {user.minecraftUsername}</p>
      <p><strong>Approved:</strong> {user.approved ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default UserDetail;
