import axios from "axios";
import config from "../config.json";
import Cookies from "js-cookie";
import { useContext } from "react";

const token = JSON.parse(Cookies.get("user-data") ?? "null")?.token;
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
axios.defaults.baseURL = config.serverBaseUrl;

export default async function api(method, url, data = null) {
  const result = await axios({
    method: method,
    url: url,
    data: data,
  }).catch((error) => {
    console.log(error.code);
    return null;
  });
  console.log(result);
  if (result) {
    return result;
  }
  return null;
}
