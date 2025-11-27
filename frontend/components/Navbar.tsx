import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav style={{ padding: 20, background: "#222", color: "#fff" }}>
      <Link href="/">Home</Link>{" | "}
      {!token ? (
        <>
          <Link href="/login">Login</Link>{" | "}
          <Link href="/register">Registrar</Link>
        </>
      ) : (
        <button onClick={logout}>Sair</button>
      )}
    </nav>
  );
}
