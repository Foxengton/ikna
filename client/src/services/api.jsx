import axios from "axios";
import config from "../config.json";

export default async function api(method, url, data = {}) {
  const result = await axios({
    method: method,
    baseURL: config.serverBaseUrl,
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
