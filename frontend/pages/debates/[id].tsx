import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';
import VoteChart from '../../components/VoteChart';  // Reuse for public votes

const DebatePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [debate, setDebate] = useState(null);

  useEffect(() => {
    api.get(`/debates/${id}`).then(res => setDebate(res.data));
  }, [id]);

  // Add argument form if participant

  return (
    <div>
      {debate && (
        <>
          <h1>Debate: {debate.theme || debate.law.title}</h1>
          <div>Argumentos User1: {debate.argumentsUser1.join(', ')}</div>
          <div>Argumentos User2: {debate.argumentsUser2.join(', ')}</div>
          <VoteChart votes={{ user1: debate.publicVotesUser1, user2: debate.publicVotesUser2 }} />
        </>
      )}
    </div>
  );
};

export default DebatePage;