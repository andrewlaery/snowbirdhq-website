export function SnowbirdDocsLogo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span
        style={{
          fontFamily: 'var(--snow-font-display)',
          fontSize: '20px',
          letterSpacing: '-0.02em',
          fontWeight: 400,
          color: 'var(--snow-ink)',
          lineHeight: 1,
        }}
      >
        Snowbird
        <em
          style={{
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'var(--snow-ink)',
          }}
        >
          HQ
        </em>
      </span>
      <span
        className="snow-eyebrow"
        style={{ marginLeft: '8px', paddingLeft: '10px', borderLeft: '1px solid var(--snow-line-2)' }}
      >
        Docs
      </span>
    </span>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="relative inline-block"
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'var(--snow-ink)',
      }}
    >
      <span
        className="absolute"
        style={{
          inset: 6,
          borderRadius: '50%',
          background: 'var(--snow-bg)',
        }}
      />
      <span
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          width: 5,
          height: 5,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'var(--snow-accent)',
        }}
      />
    </span>
  );
}
