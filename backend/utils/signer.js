const crypto = require("crypto");

const SECRET = process.env.SIGNING_SECRET || "demo-secret-key";

function signPayload(payload) {
  const body = JSON.stringify(payload);
  return crypto.createHmac("sha256", SECRET).update(body).digest("hex");
}

function verifySignature(payload, signature) {
  const expected = signPayload(payload);
  return expected === signature;
}

module.exports = { signPayload, verifySignature };
