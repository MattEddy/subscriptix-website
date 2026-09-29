// Contact form → email, sent through the Subscriptix AWS account's SES
// (the same verified subscriptix.com identity the app uses for login codes).
// Runs as a Vercel serverless function; credentials live only in Vercel env vars.
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const FROM = "Subscriptix <noreply@subscriptix.com>";
const EMAIL = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;

function reply(status: number, body: object) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const { SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY, SES_REGION, CONTACT_TO } = process.env;
  if (!SES_ACCESS_KEY_ID || !SES_SECRET_ACCESS_KEY || !SES_REGION || !CONTACT_TO) {
    console.error("contact: missing SES_* or CONTACT_TO env vars");
    return reply(500, { error: "not_configured" });
  }

  // CONTACT_TO may list several recipients, comma-separated.
  const recipients = CONTACT_TO.split(",").map((a) => a.trim()).filter(Boolean);
  if (recipients.length === 0 || !recipients.every((a) => EMAIL.test(a))) {
    console.error("contact: CONTACT_TO is not a valid address list");
    return reply(500, { error: "not_configured" });
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return reply(400, { error: "bad_request" });
  }

  // Honeypot: a field real visitors never see. Bots fill it; pretend success.
  if (typeof data.website === "string" && data.website !== "") {
    return reply(200, { ok: true });
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (!name || name.length > 200 || !EMAIL.test(email) || email.length > 320 || message.length > 5000) {
    return reply(400, { error: "invalid" });
  }

  const client = new SESv2Client({
    region: SES_REGION,
    credentials: { accessKeyId: SES_ACCESS_KEY_ID, secretAccessKey: SES_SECRET_ACCESS_KEY },
  });

  try {
    await client.send(
      new SendEmailCommand({
        FromEmailAddress: FROM,
        Destination: { ToAddresses: recipients },
        // Hitting Reply answers the visitor directly.
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            Subject: { Data: `Website contact: ${name}` },
            Body: {
              Text: {
                Data: `Name: ${name}\nEmail: ${email}\n\n${message || "(no message)"}\n`,
              },
            },
          },
        },
      })
    );
  } catch (err) {
    console.error("contact: SES send failed", err);
    return reply(502, { error: "send_failed" });
  }

  return reply(200, { ok: true });
}
