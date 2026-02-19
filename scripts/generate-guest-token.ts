import { SignJWT } from "jose";

const USAGE = "Usage: npx tsx scripts/generate-guest-token.ts --expires YYYY-MM-DD";

function parseArgs(): string {
  const idx = process.argv.indexOf("--expires");
  if (idx === -1 || !process.argv[idx + 1]) {
    console.error(USAGE);
    process.exit(1);
  }
  return process.argv[idx + 1];
}

async function main() {
  const expiresArg = parseArgs();

  const expiresDate = new Date(`${expiresArg}T23:59:59Z`);
  if (isNaN(expiresDate.getTime())) {
    console.error(`Invalid date: ${expiresArg}`);
    console.error(USAGE);
    process.exit(1);
  }

  const secret = process.env.GUEST_TOKEN_SECRET;
  if (!secret) {
    console.error("GUEST_TOKEN_SECRET environment variable is not set");
    process.exit(1);
  }

  const token = await new SignJWT({ type: "guest" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresDate.getTime() / 1000))
    .sign(new TextEncoder().encode(secret));

  console.log(`https://snowbirdhq.com/docs/properties?token=${token}`);
}

main();
