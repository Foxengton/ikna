import { config, secretKey } from "../app.mjs";
import jwt from "jsonwebtoken";

export default function jwtVerify(token) {
  try {
    const data = jwt.verify(token, secretKey, { algorithms: ["HS256"] });
    return data;
  } catch {
    return false;
  }
}
