'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, type FormEvent, useEffect, useRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import type { Strings } from '@/lib/sot';

const MD_COMPONENTS: Components = {
  p: (props) => <p style={{ margin: 0 }} {...props} />,
  ul: (props) => (
    <ul style={{ margin: 0, paddingLeft: '1.3em' }} {...props} />
  ),
  ol: (props) => (
    <ol style={{ margin: 0, paddingLeft: '1.3em' }} {...props} />
  ),
  li: (props) => <li style={{ margin: '0 0 0.15em' }} {...props} />,
  strong: (props) => <strong style={{ fontWeight: 600 }} {...props} />,
  em: (props) => <em style={{ fontStyle: 'italic' }} {...props} />,
  h1: (props) => (
    <h3
      style={{
        fontFamily: 'var(--snow-font-display)',
        fontSize: '17px',
        fontWeight: 500,
        margin: 0,
      }}
      {...props}
    />
  ),
  h2: (props) => (
    <h4
      style={{
        fontFamily: 'var(--snow-font-display)',
        fontSize: '16px',
        fontWeight: 500,
        margin: 0,
      }}
      {...props}
    />
  ),
  h3: (props) => (
    <h5
      style={{
        fontFamily: 'var(--snow-font-sans)',
        fontSize: '14.5px',
        fontWeight: 600,
        margin: 0,
      }}
      {...props}
    />
  ),
  a: (props) => (
    <a
      target="_blank"
      rel="noreferrer"
      style={{ color: 'var(--snow-accent)', textDecoration: 'underline' }}
      {...props}
    />
  ),
  code: (props) => (
    <code
      style={{
        fontFamily: 'var(--snow-font-mono)',
        fontSize: '0.9em',
        background: 'var(--snow-bg-2)',
        padding: '1px 5px',
        borderRadius: '3px',
      }}
      {...props}
    />
  ),
};

interface Props {
  slug: string;
  /** Display name used in the intro line. */
  propertyName: string;
  /** Locale code passed to the chat API and used for UI strings. */
  lang: 'en' | 'zh';
  /** Pre-loaded UI strings (server component reads from SOT and passes them in). */
  strings: Strings['ask_chat'];
}

export function PropertyAskChat({ slug, propertyName, lang, strings }: Props) {
  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: `/api/chat/${slug}${lang === 'en' ? '' : `?lang=${lang}`}`,
      }),
  );
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [input, setInput] = useState('');
  const scrollerRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length, status]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput('');
  }

  function handleSuggestion(q: string) {
    if (isLoading) return;
    sendMessage({ text: q });
  }

  const intro = strings.intro.replace('{propertyName}', propertyName);

  return (
    <div
      className="not-prose my-8 flex flex-col"
      style={{
        border: '1px solid var(--snow-line)',
        borderRadius: '6px',
        background: 'var(--snow-paper)',
        minHeight: '520px',
      }}
    >
      <div
        ref={scrollerRef}
        className="flex flex-col gap-4 overflow-y-auto p-6"
        style={{ maxHeight: '560px', flex: 1 }}
      >
        {messages.length === 0 && (
          <div
            style={{
              fontFamily: 'var(--snow-font-sans)',
              fontSize: '14px',
              lineHeight: 1.6,
              color: 'var(--snow-ink-3)',
            }}
          >
            <p className="m-0">{intro}</p>
            <div
              className="mt-4 flex flex-wrap gap-2"
              aria-label={strings.suggested_aria}
            >
              {strings.suggestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSuggestion(q)}
                  disabled={isLoading}
                  style={{
                    fontFamily: 'var(--snow-font-sans)',
                    fontSize: '13px',
                    color: 'var(--snow-ink-2)',
                    background: 'var(--snow-bg)',
                    border: '1px solid var(--snow-line)',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const text = m.parts
            .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
            .map((p) => p.text)
            .join('');
          if (!text) return null;
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={isUser ? 'self-end' : 'self-start'}
              style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '10px',
                background: isUser ? 'var(--snow-ink)' : 'var(--snow-bg)',
                color: isUser ? 'var(--snow-bg)' : 'var(--snow-ink-2)',
                border: isUser ? 'none' : '1px solid var(--snow-line)',
                fontFamily: 'var(--snow-font-sans)',
                fontSize: '14.5px',
                lineHeight: 1.55,
                whiteSpace: isUser ? 'pre-wrap' : 'normal',
              }}
            >
              {isUser ? (
                text
              ) : (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.55em' }}
                >
                  <ReactMarkdown components={MD_COMPONENTS}>{text}</ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}

        {isLoading &&
          messages[messages.length - 1]?.role === 'user' && (
            <div
              className="self-start"
              style={{
                padding: '12px 16px',
                fontFamily: 'var(--snow-font-sans)',
                fontSize: '14px',
                color: 'var(--snow-ink-3)',
              }}
            >
              {strings.thinking}
            </div>
          )}

        {error && (
          <div
            className="self-start"
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#F7E6E2',
              color: '#8A2A1F',
              border: '1px solid #E8C4BC',
              fontFamily: 'var(--snow-font-sans)',
              fontSize: '13.5px',
              maxWidth: '85%',
            }}
          >
            {strings.error_generic}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t p-4"
        style={{ borderColor: 'var(--snow-line)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={strings.placeholder}
          disabled={isLoading}
          style={{
            flex: 1,
            fontFamily: 'var(--snow-font-sans)',
            fontSize: '14.5px',
            color: 'var(--snow-ink)',
            background: 'var(--snow-bg)',
            border: '1px solid var(--snow-line)',
            borderRadius: '6px',
            padding: '10px 14px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isLoading || input.trim().length === 0}
          style={{
            fontFamily: 'var(--snow-font-sans)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--snow-bg)',
            background: 'var(--snow-ink)',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor:
              isLoading || input.trim().length === 0 ? 'not-allowed' : 'pointer',
            opacity: isLoading || input.trim().length === 0 ? 0.4 : 1,
          }}
        >
          {strings.send}
        </button>
      </form>
    </div>
  );
}
