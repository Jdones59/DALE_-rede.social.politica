'use client';
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";


export default function Login() {
const { login } = useAuth();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");


const submit = async () => {
await login(email, password);
};


return (
<div className="max-w-md mx-auto">
<h2 className="text-2xl font-bold">Entrar</h2>
<input className="input" placeholder="Email" onChange={e => setEmail(e.target.value)} />
<input className="input mt-2" placeholder="Senha" type="password" onChange={e => setPassword(e.target.value)} />
<button onClick={submit} className="btn mt-4">Entrar</button>
</div>
);
}