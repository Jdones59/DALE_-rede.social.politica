import React from 'react';
import api from './services/api';

const FriendButton = ({ userId }: any) => {
  const handleAdd = async () => {
    await api.post('/friendships/add', { receiverId: userId });
  };

  return <button onClick={handleAdd}>Adicionar Amigo</button>;
};

export default FriendButton;