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
    <div className="not-prose my-6 rounded-lg border border-fd-border bg-fd-card p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-fd-muted-foreground">
        Quick Reference
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Address" value={address} />
        <Field label="Parking" value={parking} />
        <Field label="Check-in" value={checkIn} />
        <Field label="Check-out" value={checkOut} />
        {wifi && <Field label="WiFi Network" value={wifi} />}
        {wifiPassword && (
          <Field label="WiFi Password" value={wifiPassword} mono />
        )}
      </div>
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
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm text-fd-foreground${mono ? ' font-mono' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}
