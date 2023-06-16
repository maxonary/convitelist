import React, { useEffect, useState } from 'react';
import api from '../api';

interface User {
  id: number;
  minecraftUsername: string;
  approved: boolean;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get('/user')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const toggleApproval = (user: User) => {
    const endpoint = user.approved ? 'reject' : 'approve';
    api.put(`/user/${user.id}/${endpoint}`)
      .then(response => {
        setUsers(prevUsers => prevUsers.map(u => u.id === response.data.id ? response.data : u));
      })
      .catch(error => console.error(error));
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Approved</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.minecraftUsername}</td>
            <td>{user.approved ? 'Yes' : 'No'}</td>
            <td>
              <input 
                type="checkbox" 
                checked={user.approved} 
                onChange={() => toggleApproval(user)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
