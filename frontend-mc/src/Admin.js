import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = 'http://localhost:3001'; // Replace with your server URL

function Admin() {
  const [users, setUsers] = useState([]);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');

  useEffect(() => {
    if (adminToken) {
      getUsers();
    }
  }, [adminToken]);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/admin/login`, {
        username: adminUsername,
        password: adminPassword,
      });
      setAdminToken(response.data.token);
    } catch (err) {
      console.error('Error logging in as admin:', err);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await axios.patch(`${apiUrl}/admin/approve/${userId}`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      getUsers();
    } catch (err) {
      console.error('Error approving user:', err);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await axios.patch(`${apiUrl}/admin/reject/${userId}`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      getUsers();
    } catch (err) {
      console.error('Error rejecting user:', err);
    }
  };

  return (
    <div className="Admin">
      <h1>Admin Panel</h1>
      {!adminToken ? (
        <form onSubmit={handleAdminLogin}>
          <div>
            <label>
              Admin Username:
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Admin Password:
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Log In</button>
        </form>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Minecraft Username</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.minecraftUsername}</td>
                <td>{user.approved ? 'Approved' : 'Rejected'}</td>
                <td>
                  <button onClick={() => handleApproveUser(user.id)}>Approve</button>
                  <button onClick={() => handleRejectUser(user.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;
