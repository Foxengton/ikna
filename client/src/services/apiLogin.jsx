import axios from "axios";
import Cookies from "js-cookie";
/*
  obj: {
    username: username,
    password: password,
           OR
    token: token
  }
*/
const api = axios.create({
  baseURL: "http://127.0.0.1:3000/api",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

export default async function apiLogin(obj) {
  const result = await api.post("/login", obj).catch((error) => {
    console.log(error.code);
    return null;
  });
  console.log(result);
  if (result) {
    Cookies.set("user-data", JSON.stringify(result.data));
    return result;
  }
  return null;
}
