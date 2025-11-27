import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="pt-BR">
<body>
<AuthProvider>
<Navbar />
<main className="p-6 max-w-5xl mx-auto">{children}</main>
</AuthProvider>
</body>
</html>
);
}