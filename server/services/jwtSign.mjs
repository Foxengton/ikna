import { config, secretKey } from "../app.mjs";
import jwt from "jsonwebtoken";

export default function jwtSign(data) {
  return jwt.sign(data, Buffer.from(secretKey, "base64"), {
    algorithm: "HS256",
    expiresIn: config.jwtExpirationTime,
  });
}
