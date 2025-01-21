import { secretKey } from "../app.mjs";
import jwt from "jsonwebtoken";

export default function jwtVerify(token) {
  try {
    const data = jwt.verify(token, Buffer.from(secretKey, "base64"), {
      algorithms: ["HS256"],
    });
    return data;
  } catch {
    return false;
  }
}
