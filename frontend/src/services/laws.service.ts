import api from "./api";


export const getLaws = async () => {
const res = await api.get("/laws");
return res.data;
};