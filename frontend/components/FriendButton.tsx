import api from "./services/api";

export default function FriendButton({ id }: any) {
  async function add() {
    await api.post(`/friends/add/${id}`);
  }

  return <button onClick={add}>Adicionar amigo</button>;
}
