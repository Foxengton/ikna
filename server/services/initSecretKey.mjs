import { config } from "../app.mjs";
import fs from "fs";
import cryptoRandomString from "crypto-random-string";

export default async function initSecretKey() {
  try {
    // Secret key exists
    return await fs.readFileSync("./secret.key", { encoding: "utf8" });
  } catch {
    // Creating a new secret key
    const secretKey = cryptoRandomString({
      length: config.secretKeyLength,
      type: "base64",
    });
    await fs.writeFileSync("./secret.key", secretKey, { encoding: "utf8" });
    return secretKey;
  }
}
