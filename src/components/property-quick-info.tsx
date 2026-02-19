interface PropertyQuickInfoProps {
  wifi: string;
  wifiPassword: string;
  checkIn: string;
  checkOut: string;
  address: string;
  parking: string;
}

export function PropertyQuickInfo({
  wifi,
  wifiPassword,
  checkIn,
  checkOut,
  address,
  parking,
}: PropertyQuickInfoProps) {
  return (
    <div className="not-prose my-6 rounded-lg border border-fd-border bg-fd-card p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-fd-muted-foreground">
        Quick Reference
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
            Address
          </p>
          <p className="mt-0.5 text-sm text-fd-foreground">{address}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
            Parking
          </p>
          <p className="mt-0.5 text-sm text-fd-foreground">{parking}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
            Check-in
          </p>
          <p className="mt-0.5 text-sm text-fd-foreground">{checkIn}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
            Check-out
          </p>
          <p className="mt-0.5 text-sm text-fd-foreground">{checkOut}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
            WiFi Network
          </p>
          <p className="mt-0.5 text-sm text-fd-foreground">{wifi}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
            WiFi Password
          </p>
          <p className="mt-0.5 font-mono text-sm text-fd-foreground">
            {wifiPassword}
          </p>
        </div>
      </div>
    </div>
  );
}
