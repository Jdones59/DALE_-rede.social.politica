'use client';
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { loginUser, getProfile } from "@/services/auth.service";


const AuthContext = createContext<any>(null);


export function AuthProvider({ children }: any) {
const [user, setUser] = useState(null);


useEffect(() => {
const token = Cookies.get("token");
if (token) getProfile().then(setUser);
}, []);


const login = async (email: string, password: string) => {
const data = await loginUser(email, password);
Cookies.set("token", data.token);
setUser(data.user);
};


const logout = () => {
Cookies.remove("token");
setUser(null);
};


return (
<AuthContext.Provider value={{ user, login, logout }}>
{children}
</AuthContext.Provider>
);
}


export const useAuth = () => useContext(AuthContext);