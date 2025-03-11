import axios from "axios";
import Cookies from "js-cookie";

export default async function api(method, url, data = null) {
  const token = JSON.parse(Cookies.get("user-data") ?? "null")?.token;
  const result = await axios({
    method: method,
    url: url,
    baseURL: import.meta.env.VITE_SERVER_BASE_URL || "http://127.0.0.1:3000/api",
    data: data,
    headers: {
      common: {
        Authorization: `Bearer ${token}`,
      },
    },
  }).catch((error) => {
    console.log(error.code);
    return null;
  });
  if (result) {
    return result;
  }
  return null;
}
