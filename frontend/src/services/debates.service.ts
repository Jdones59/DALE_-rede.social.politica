import api from "./api";


export const getDebates = async () => {
const res = await api.get("/debates");
return res.data;
};