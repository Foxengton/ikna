import { config } from "../app.mjs";
import fs from "fs";
import crypto from "node:crypto";

export default async function initSecretKey() {
  try {
    // Secret key exists
    const buffer = fs.readFileSync("./secret.key", { encoding: "utf-8" });
    return Buffer.from(buffer, "base64");
  } catch {
    // Creating a new secret key
    const secretKey = crypto.randomBytes(config.secretKeySize);
    await fs.writeFileSync("./secret.key", secretKey.toString("base64"));
    return secretKey;
  }
}
