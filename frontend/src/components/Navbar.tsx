'use client';
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";


export default function Navbar() {
const { user, logout } = useAuth();


return (
<nav className="w-full bg-gray-900 text-white p-4 flex justify-between">
<Link href="/" className="font-bold">DebateLigs</Link>


<div className="flex gap-4">
<Link href="/leis">Leis</Link>
<Link href="/debates">Debates</Link>


{user ? (
<>
<Link href="/perfil">Perfil</Link>
<button onClick={logout}>Sair</button>
</>
) : (
<>
<Link href="/login">Entrar</Link>
<Link href="/register">Registrar</Link>
</>
)}
</div>
</nav>
);
}