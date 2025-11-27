import api from "./api";


export const loginUser = async (email: string, password: string) => {
const res = await api.post("/users/login", { email, password });
return res.data;
};


export const registerUser = async (data: any) => {
const res = await api.post("/users/register", data);
return res.data;
};


export const getProfile = async () => {
const res = await api.get("/users/profile");
return res.data;
};