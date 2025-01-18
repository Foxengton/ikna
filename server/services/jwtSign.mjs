import { config, secretKey } from "../app.mjs";
import jwt from "jsonwebtoken";

export default function jwtSign(data) {
  return jwt.sign(data, secretKey, {
    algorithm: "HS256",
    expiresIn: config.jwtExpirationTime,
  });
}
