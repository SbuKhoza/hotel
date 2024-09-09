import { useEffect, useState } from 'react';
import { getUsersFromFirestore, removeUserFromFirestore } from '../firebase/firestoreService';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsersFromFirestore();
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    await removeUserFromFirestore(userId);
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div>
      <h2>User Management</h2>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.email}</p>
          <button onClick={() => handleDeleteUser(user.id)}>Delete User</button>
        </div>
      ))}
    </div>
  );
};

export default AdminUserManagement;