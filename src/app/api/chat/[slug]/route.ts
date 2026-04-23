import { anthropic } from '@ai-sdk/anthropic';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { NextResponse, type NextRequest } from 'next/server';
import { verifyCookie } from '@/lib/auth/docs-cookie';
import { loadPropertyDocs } from '@/lib/chat/property-context';
import { buildSystemPrompt } from '@/lib/chat/prompt';
import { checkRateLimit, getClientIp } from '@/lib/chat/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL_ID = 'claude-haiku-4-5-20251001';

async function isAuthorised(request: NextRequest, slug: string): Promise<boolean> {
  const secret = process.env.DOCS_COOKIE_SECRET;
  // Fail-open when the signing secret isn't configured (mirrors middleware) —
  // keeps local dev working without forcing everyone to provision secrets.
  if (!secret) return true;

  const portal = request.cookies.get('docs_portal')?.value;
  if (portal && (await verifyCookie(portal, secret)) === '1') return true;

  const property = request.cookies.get('docs_property')?.value;
  if (property && (await verifyCookie(property, secret)) === slug) return true;

  return false;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!(await isAuthorised(request, slug))) {
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(`${ip}:${slug}`);
  if (!limit.ok) {
    const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: 'rate_limited', retryAfter },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  const ctx = await loadPropertyDocs(slug);
  if (!ctx) {
    return NextResponse.json({ error: 'property_not_found' }, { status: 404 });
  }

  const { messages } = (await request.json()) as { messages: UIMessage[] };

  const systemText = buildSystemPrompt(ctx);
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic(MODEL_ID),
    messages: [
      {
        role: 'system',
        content: systemText,
        providerOptions: {
          anthropic: { cacheControl: { type: 'ephemeral' } },
        },
      },
      ...modelMessages,
    ],
    maxOutputTokens: 600,
    onFinish: ({ usage }) => {
      const cacheRead = usage.inputTokenDetails?.cacheReadTokens ?? 0;
      const cacheWrite = usage.inputTokenDetails?.cacheWriteTokens ?? 0;
      console.log(
        `[chat] slug=${slug} ip=${ip} input=${usage.inputTokens} output=${usage.outputTokens} cache_read=${cacheRead} cache_write=${cacheWrite}`,
      );
    },
  });

  return result.toUIMessageStreamResponse();
}
