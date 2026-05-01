import {
  loadFacts,
  loadIdentity,
  formatAddress,
  formatTime,
  formatParking,
  type Lang,
} from '@/lib/sot';

interface PropertyQuickInfoProps {
  /** Property slug (e.g. "7-suburb"). Loads facts + identity from SOT. */
  slug?: string;
  /** Locale. When set, loads from the locale's translated overlay. */
  lang?: Lang;
  /** Manual overrides — only honoured if `slug` is not given. */
  address?: string;
  parking?: string;
  checkIn?: string;
  checkOut?: string;
  wifi?: string;
  wifiPassword?: string;
}

const LABELS = {
  en: {
    title: 'Quick Reference',
    address: 'Address',
    parking: 'Parking',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    wifi: 'WiFi Network',
    wifiPassword: 'WiFi Password',
  },
  zh: {
    title: '快速参考',
    address: '地址',
    parking: '停车',
    checkIn: '入住',
    checkOut: '退房',
    wifi: 'WiFi 名称',
    wifiPassword: 'WiFi 密码',
  },
  ja: {
    title: '基本情報',
    address: '住所',
    parking: '駐車場',
    checkIn: 'チェックイン',
    checkOut: 'チェックアウト',
    wifi: 'WiFi ネットワーク',
    wifiPassword: 'WiFi パスワード',
  },
} as const;

export function PropertyQuickInfo(props: PropertyQuickInfoProps) {
  const lang: Lang = props.lang ?? 'en';
  const fields = props.slug ? renderFromSot(props.slug, lang) : props;
  const t = LABELS[lang];

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
          {t.title}
        </h3>
      </div>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        {fields.address && <Field label={t.address} value={fields.address} />}
        {fields.parking && <Field label={t.parking} value={fields.parking} />}
        {fields.checkIn && <Field label={t.checkIn} value={fields.checkIn} />}
        {fields.checkOut && <Field label={t.checkOut} value={fields.checkOut} />}
        {fields.wifi && <Field label={t.wifi} value={fields.wifi} mono />}
        {fields.wifiPassword && (
          <Field label={t.wifiPassword} value={fields.wifiPassword} mono />
        )}
      </dl>
    </div>
  );
}

function renderFromSot(
  slug: string,
  lang: Lang,
): {
  address: string;
  parking: string;
  checkIn: string;
  checkOut: string;
  wifi: string;
  wifiPassword: string;
} {
  const identity = loadIdentity(slug, lang);
  const facts = loadFacts(slug, lang);
  const checkInTime = formatTime(facts.check_in.start_time, lang);
  const checkOutTime = formatTime(facts.check_out.time, lang);
  return {
    address: formatAddress(identity.address),
    parking: formatParking(facts.parking, lang),
    checkIn:
      lang === 'zh'
        ? `${checkInTime} 后入住`
        : lang === 'ja'
          ? `${checkInTime} 以降`
          : `After ${checkInTime}`,
    checkOut:
      lang === 'zh'
        ? `${checkOutTime} 前退房`
        : lang === 'ja'
          ? `${checkOutTime} まで`
          : `Before ${checkOutTime}`,
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
