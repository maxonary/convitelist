import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/UserTable.css';

interface User {
  id: number;
  minecraftUsername: string;
  gameType: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleApproval = (user: User) => {
    const endpoint = user.approved ? 'reject' : 'approve';
    api.put(`/user/${user.id}/${endpoint}`)
      .then(response => {
        setUsers(prevUsers => prevUsers.map(u => u.id === response.data.id ? response.data : u));
      })
      .catch(error => console.error(error));
  };

  const deleteHandler = async (userId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');

    if (confirmed) {
      try {
        await api.delete(`/user/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };
  };

  const formatGameType = (gameType: string) => {  
    switch (gameType) {
      case 'Bedrock Edition':
        return 'Bedrock';
      case 'Java Edition':
        return 'Java';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
    return { date: formattedDate, time: formattedTime };
  };  

  const handleMouseEnter = (event: React.MouseEvent<HTMLTableCellElement>, user: User) => {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.innerHTML = `Registered at: ${formatDate(user.createdAt).date} ${formatDate(user.createdAt).time}<br>Updated at: ${formatDate(user.updatedAt).date} ${formatDate(user.updatedAt).time}`;
      tooltip.style.display = 'block';
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY}px`;
    }
  };

  const handleMouseLeave = () => {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  };

  return (
    <>
      <div id="tooltip" style={{ position: 'absolute', display: 'none' }}></div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Game Type</th>
            <th>Approved</th>
            <th>Action</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td 
                onMouseEnter={event => handleMouseEnter(event, user)}
                onMouseLeave={handleMouseLeave}
              >
                {user.minecraftUsername}
              </td>
              <td>{formatGameType(user.gameType)}</td>
              <td>{user.approved ? 'Yes' : 'No'}</td>
              <td>
                <input 
                  type="checkbox" 
                  checked={user.approved} 
                  onChange={() => toggleApproval(user)}
                />
              </td>
              <td>
                <button onClick={() => deleteHandler(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserTable;
