import { loadFacts, loadIdentity, formatAddress } from '@/lib/sot';

interface Props {
  slug: string;
}

export function PropertyQuickInfoZh({ slug }: Props) {
  const identity = loadIdentity(slug, 'zh');
  const facts = loadFacts(slug, 'zh');
  const fields = {
    address: formatAddress(identity.address),
    parking: formatParkingZh(facts.parking),
    checkIn: `${formatTimeZh(facts.check_in.start_time)} 后入住`,
    checkOut: `${formatTimeZh(facts.check_out.time)} 前退房`,
    wifi: facts.wifi.network,
    wifiPassword: facts.wifi.password,
  };

  return (
    <div
      className="not-prose my-8 rounded-md border p-6"
      style={{ background: 'var(--snow-paper)', borderColor: 'var(--snow-line)' }}
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
          快速参考
        </h3>
      </div>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <Field label="地址" value={fields.address} />
        <Field label="停车" value={fields.parking} />
        <Field label="入住" value={fields.checkIn} />
        <Field label="退房" value={fields.checkOut} />
        <Field label="WiFi 名称" value={fields.wifi} mono />
        <Field label="WiFi 密码" value={fields.wifiPassword} mono />
      </dl>
    </div>
  );
}

function formatTimeZh(t: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (!m) return t;
  const hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const period = hour >= 12 ? '下午' : '上午';
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return minute === 0 ? `${period}${h12}点` : `${period}${h12}点${minute}分`;
}

function formatParkingZh(parking?: {
  spaces?: number;
  type?: string;
  garage?: boolean;
  garage_remote?: boolean;
}): string {
  if (!parking) return '请参阅指南';
  const parts: string[] = [];
  if (parking.spaces) parts.push(`${parking.spaces} 个车位`);
  if (parking.garage) parts.push(parking.garage_remote ? '带遥控器的车库' : '车库');
  return parts.length ? parts.join('，') : '请参阅指南';
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
