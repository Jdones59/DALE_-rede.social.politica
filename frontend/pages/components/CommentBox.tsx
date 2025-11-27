import React, { useState } from 'react';
import api from './services/api';

const CommentBox = ({ lawId }: any) => {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    await api.post('/comments', { lawId, text });
    setText('');
  };

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSubmit}>Comentar</button>
    </div>
  );
};

export default CommentBox;