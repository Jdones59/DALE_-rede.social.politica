import React, { useState } from 'react';
import api from './services/api';

const DebateInvite = ({ lawId }: any) => {
  const [user2Id, setUser2Id] = useState('');

  const handleInvite = async () => {
    await api.post('/debates', { user2Id, lawId });
  };

  return (
    <div>
      <input value={user2Id} onChange={e => setUser2Id(e.target.value)} placeholder="ID do Usuário" />
      <button onClick={handleInvite}>Desafiar para Debate</button>
    </div>
  );
};

export default DebateInvite;