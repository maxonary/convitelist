import React, { useEffect, useState } from 'react';
import { apiJwt } from '../api';
import { copyToClipboard } from '../utils/clipboardUtils';
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
    fetchUsers()
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('[UserTable] Fetching users...');
      const stored = localStorage.getItem('__auth__');
      console.log('[UserTable] localStorage __auth__:', stored ? 'exists' : 'missing');
      if (stored) {
        try {
          const authData = JSON.parse(stored);
          console.log('[UserTable] Token type:', authData.type, 'Token exists:', !!authData.token);
        } catch (e) {
          console.log('[UserTable] Token stored as plain string');
        }
      }
      const response = await apiJwt.get('/api/user');
      console.log('[UserTable] Success! Received', response.data.length, 'users');
      setUsers(response.data);
    } catch (error: any) {
      console.error('[UserTable] Error fetching users:', error);
      if (error.response?.status === 401) {
        console.error('[UserTable] 401 Unauthorized - You are not logged in or token is invalid');
        console.error('[UserTable] Please log in at /admin/login');
        console.error('[UserTable] Current localStorage:', localStorage.getItem('__auth__'));
      }
    }
  };

  const toggleApproval = (user: User) => {
    const endpoint = user.approved ? 'reject' : 'approve';
    apiJwt.put(`/api/user/${user.id}/${endpoint}`)
      .then(response => {
        setUsers(prevUsers => prevUsers.map(u => u.id === response.data.id ? response.data : u));
      })
      .catch(error => console.error(error));
  };

  const handleDelete = async (userId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');

    if (confirmed) {
      try {
        await apiJwt.delete(`/api/user/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
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

  const handleUsernameClick = (user: User) => {
    copyToClipboard(user.minecraftUsername);
    const usernameCell = document.getElementById(`username-${user.minecraftUsername}-${user.id}`);
    if (usernameCell) {
      usernameCell.textContent = 'Copied to Clipboard';
      setTimeout(() => {
        usernameCell.textContent = user.minecraftUsername;
      }, 1500);
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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td 
                id={`username-${user.minecraftUsername}-${user.id}`}
                onMouseEnter={event => handleMouseEnter(event, user)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleUsernameClick(user)}
                style={{ cursor: 'pointer' }}
              >
                {user.minecraftUsername}
              </td>
              <td>{formatGameType(user.gameType)}</td>
              <td>{user.approved ? 'Yes' : 'No'}
                <input 
                  type="checkbox" 
                  checked={user.approved} 
                  onChange={() => toggleApproval(user)}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserTable;
