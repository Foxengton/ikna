import axios from "axios";
import Cookies from "js-cookie";
/*
  obj: {
    username: username,
    password: password
  }
*/
export default async function apiRegister(obj) {
  const [result] = await axios
    .post("localhost:3000/api/register", obj)
    .catch((error) => {
      console.log(error);
      return null;
    });
  if (result.code === 200) {
    Cookies.set("user-data", result);
    return result;
  }
  return null;
}
