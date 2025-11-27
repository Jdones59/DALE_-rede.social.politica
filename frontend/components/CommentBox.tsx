import { useState } from "react";
import api from "./services/api";

export default function CommentBox({ lawId }: any) {
  const [text, setText] = useState("");

  async function send() {
    await api.post(`/comments/${lawId}`, { text });
    setText("");
  }

  return (
    <div>
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={send}>Enviar</button>
    </div>
  );
}
