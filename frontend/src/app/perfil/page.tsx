'use client';
import { useAuth } from "@/context/AuthContext";


export default function Perfil() {
const { user } = useAuth();


if (!user) return <p>Carregando...</p>;


return (
<div>
<h1 className="text-3xl font-bold">Perfil</h1>
<p>Nome: {user.name}</p>
<p>Email: {user.email}</p>
</div>
);
}