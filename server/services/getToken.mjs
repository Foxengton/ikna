export default function getToken(req) {
  return req.headers.authorization?.split(" ")[1];
}
