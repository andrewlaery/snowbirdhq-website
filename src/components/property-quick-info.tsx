interface PropertyQuickInfoProps {
  address: string;
  parking: string;
  checkIn: string;
  checkOut: string;
  wifi?: string;
  wifiPassword?: string;
}

export function PropertyQuickInfo({
  address,
  parking,
  checkIn,
  checkOut,
  wifi,
  wifiPassword,
}: PropertyQuickInfoProps) {
  return (
    <div
      className="not-prose my-8 rounded-md border p-6"
      style={{
        background: 'var(--snow-paper)',
        borderColor: 'var(--snow-line)',
      }}
    >
      <div className="mb-5 flex items-center gap-2.5">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: 'var(--snow-accent)' }}
        />
        <h3
          className="m-0"
          style={{
            fontFamily: 'var(--snow-font-mono)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--snow-ink-3)',
            fontWeight: 500,
          }}
        >
          Quick Reference
        </h3>
      </div>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <Field label="Address" value={address} />
        <Field label="Parking" value={parking} />
        <Field label="Check-in" value={checkIn} />
        <Field label="Check-out" value={checkOut} />
        {wifi && <Field label="WiFi Network" value={wifi} />}
        {wifiPassword && (
          <Field label="WiFi Password" value={wifiPassword} mono />
        )}
      </dl>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt
        style={{
          fontFamily: 'var(--snow-font-mono)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--snow-ink-3)',
          fontWeight: 500,
        }}
      >
        {label}
      </dt>
      <dd
        className="m-0"
        style={
          mono
            ? {
                fontFamily: 'var(--snow-font-mono)',
                fontSize: '14px',
                color: 'var(--snow-ink)',
              }
            : {
                fontFamily: 'var(--snow-font-display)',
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: 1.25,
                color: 'var(--snow-ink)',
                letterSpacing: '-0.005em',
              }
        }
      >
        {value}
      </dd>
    </div>
  );
}
