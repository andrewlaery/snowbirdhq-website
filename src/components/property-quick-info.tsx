import {
  loadFacts,
  loadIdentity,
  formatAddress,
  formatTime,
  formatParking,
} from '@/lib/sot';

interface PropertyQuickInfoProps {
  /** Property slug (e.g. "7-suburb"). Loads facts + identity from SOT. */
  slug?: string;
  /** Manual overrides — only honoured if `slug` is not given. */
  address?: string;
  parking?: string;
  checkIn?: string;
  checkOut?: string;
  wifi?: string;
  wifiPassword?: string;
}

export function PropertyQuickInfo(props: PropertyQuickInfoProps) {
  const fields = props.slug ? renderFromSot(props.slug) : props;

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
        {fields.address && <Field label="Address" value={fields.address} />}
        {fields.parking && <Field label="Parking" value={fields.parking} />}
        {fields.checkIn && <Field label="Check-in" value={fields.checkIn} />}
        {fields.checkOut && <Field label="Check-out" value={fields.checkOut} />}
        {fields.wifi && <Field label="WiFi Network" value={fields.wifi} mono />}
        {fields.wifiPassword && (
          <Field label="WiFi Password" value={fields.wifiPassword} mono />
        )}
      </dl>
    </div>
  );
}

function renderFromSot(slug: string): {
  address: string;
  parking: string;
  checkIn: string;
  checkOut: string;
  wifi: string;
  wifiPassword: string;
} {
  const identity = loadIdentity(slug);
  const facts = loadFacts(slug);
  return {
    address: formatAddress(identity.address),
    parking: formatParking(facts.parking),
    checkIn: `After ${formatTime(facts.check_in.start_time)}`,
    checkOut: `Before ${formatTime(facts.check_out.time)}`,
    wifi: facts.wifi.network,
    wifiPassword: facts.wifi.password,
  };
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
