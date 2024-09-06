import React, { useState } from 'react';
import { addDoc, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AdminDashboard.css';

function AdminDashboard() {
  const [roomDetails, setRoomDetails] = useState({
    roomName: '',
    price: '',
   
  });
  const [rooms, setRooms] = useState([]); 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRoomDetails({ ...roomDetails, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(db, 'rooms'), roomDetails);
      alert('Room added successfully!');
      setRoomDetails({ roomName: '', price: '' });
    } catch (error) {
      console.error('Error adding room: ', error);
    }
  };

  const handleUpdate = async (roomId) => {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, { ...roomDetails });
    alert('Room updated successfully!');
  };

  const handleDelete = async (roomId) => {
    await deleteDoc(doc(db, 'rooms', roomId));
    alert('Room deleted successfully!');
  };

  return (
    <div className='admin-dashboard'>
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Room Name:
          <input type="text" name="roomName" value={roomDetails.roomName} onChange={handleChange} required />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={roomDetails.price} onChange={handleChange} required />
        </label>
        <button type="submit">Add Room</button>
      </form>

      <div className='room-list'>
        <h3>Manage Rooms</h3>
        {rooms.map(room => (
          <div key={room.id} className='room-item'>
            <span>{room.roomName} - ${room.price}</span>
            <button onClick={() => handleUpdate(room.id)}>Edit</button>
            <button onClick={() => handleDelete(room.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;