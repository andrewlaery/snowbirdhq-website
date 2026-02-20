import { SignJWT } from "jose";

const USAGE =
  "Usage: npx tsx scripts/generate-guest-token.ts --property <slug> --expires YYYY-MM-DD";

function parseArgs(): { property: string; expires: string } {
  const propIdx = process.argv.indexOf("--property");
  if (propIdx === -1 || !process.argv[propIdx + 1]) {
    console.error("Missing --property flag");
    console.error(USAGE);
    process.exit(1);
  }

  const expiresIdx = process.argv.indexOf("--expires");
  if (expiresIdx === -1 || !process.argv[expiresIdx + 1]) {
    console.error("Missing --expires flag");
    console.error(USAGE);
    process.exit(1);
  }

  return {
    property: process.argv[propIdx + 1].toLowerCase(),
    expires: process.argv[expiresIdx + 1],
  };
}

async function main() {
  const { property, expires } = parseArgs();

  const expiresDate = new Date(`${expires}T23:59:59Z`);
  if (isNaN(expiresDate.getTime())) {
    console.error(`Invalid date: ${expires}`);
    console.error(USAGE);
    process.exit(1);
  }

  const secret = process.env.GUEST_TOKEN_SECRET;
  if (!secret) {
    console.error("GUEST_TOKEN_SECRET environment variable is not set");
    process.exit(1);
  }

  const token = await new SignJWT({ type: "guest", property })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresDate.getTime() / 1000))
    .sign(new TextEncoder().encode(secret));

  console.log(
    `https://docs.snowbirdhq.com/docs/properties/${property}?token=${token}`
  );
}

main();
