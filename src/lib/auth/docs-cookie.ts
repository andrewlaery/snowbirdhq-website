// HMAC-signed cookie helpers for the docs access gate. Works in both the
// Node.js runtime (API route handlers, server components) and the Edge
// runtime (middleware) via the Web Crypto API.
//
// Cookie format: `<value>.<hex-hmac-sha256>`. verifyCookie returns the
// decoded value on success or null on any failure (missing cookie, wrong
// format, HMAC mismatch, non-hex signature).

const encoder = new TextEncoder();

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function signCookie(value: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return `${value}.${bufferToHex(signature)}`;
}

export async function verifyCookie(
  cookie: string | undefined,
  secret: string,
): Promise<string | null> {
  if (!cookie) return null;
  const lastDot = cookie.lastIndexOf('.');
  if (lastDot < 1) return null;

  const value = cookie.slice(0, lastDot);
  const providedHex = cookie.slice(lastDot + 1);
  if (!/^[0-9a-f]+$/.test(providedHex)) return null;

  const key = await getKey(secret);
  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  const expectedHex = bufferToHex(sigBuffer);
  if (providedHex.length !== expectedHex.length) return null;

  let mismatch = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    mismatch |= providedHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  }
  return mismatch === 0 ? value : null;
}
