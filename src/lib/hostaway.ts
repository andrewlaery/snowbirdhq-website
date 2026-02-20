const HOSTAWAY_API = 'https://api.hostaway.com/v1';

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const res = await fetch(`${HOSTAWAY_API}/accessTokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.HOSTAWAY_CLIENT_ID!,
      client_secret: process.env.HOSTAWAY_CLIENT_SECRET!,
      scope: 'general',
    }),
  });

  if (!res.ok) {
    throw new Error(`Hostaway token request failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

function getNZNow(): Date {
  const nzString = new Date().toLocaleString('en-US', { timeZone: 'Pacific/Auckland' });
  return new Date(nzString);
}

function getNZDate(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland' }).format(new Date());
}

function buildNZDateTime(dateStr: string, hourOrTimeStr: number | string): Date {
  let hours: number;
  let minutes: number;
  if (typeof hourOrTimeStr === 'number') {
    hours = hourOrTimeStr;
    minutes = 0;
  } else {
    [hours, minutes] = hourOrTimeStr.split(':').map(Number);
  }
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return new Date(`${dateStr}T${hh}:${mm}:00`);
}

export interface CurrentReservation {
  guestName: string;
  arrivalDate: string;
  departureDate: string;
  numberOfGuests: number;
  notificationMessage: string | null;
}

export async function getCurrentReservation(listingId: number): Promise<CurrentReservation | null> {
  const token = await getToken();
  const today = getNZDate();

  const dateStart = new Date(today);
  dateStart.setDate(dateStart.getDate() - 7);
  const dateEnd = new Date(today);
  dateEnd.setDate(dateEnd.getDate() + 14);

  const params = new URLSearchParams({
    listingId: String(listingId),
    sortOrder: 'arrivalDate',
    arrivalStartDate: dateStart.toISOString().split('T')[0],
    arrivalEndDate: dateEnd.toISOString().split('T')[0],
    limit: '20',
  });

  const res = await fetch(`${HOSTAWAY_API}/reservations?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Hostaway reservations request failed: ${res.status}`);
  }

  const data = await res.json();
  const reservations = data.result ?? [];

  const activeStatuses = ['new', 'confirmed', 'modified', 'ownerStay'];
  const nowNZ = getNZNow();

  const current = reservations.find((r: Record<string, unknown>) => {
    if (!activeStatuses.includes(r.status as string)) return false;

    const checkInTime = (r.checkInTime as number | string) ?? 15;
    const checkOutTime = (r.checkOutTime as number | string) ?? 10;

    const showFrom = buildNZDateTime(r.arrivalDate as string, checkInTime);
    showFrom.setHours(showFrom.getHours() - 2);

    const showUntil = buildNZDateTime(r.departureDate as string, checkOutTime);
    showUntil.setHours(showUntil.getHours() + 2);

    return nowNZ >= showFrom && nowNZ < showUntil;
  });

  if (!current) return null;

  // List endpoint returns empty customFieldValues — fetch individual reservation
  const reservationId = current.id as number;
  const detailRes = await fetch(`${HOSTAWAY_API}/reservations/${reservationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let notificationMessage: string | null = null;
  if (detailRes.ok) {
    const detailData = await detailRes.json();
    const customFields = detailData.result?.customFieldValues as Record<string, unknown>[] | undefined;
    if (Array.isArray(customFields)) {
      const msgField = customFields.find((f: Record<string, unknown>) => {
        const cf = f.customField as Record<string, unknown> | undefined;
        return cf?.name === 'NoficationMessage';
      });
      if (msgField && typeof msgField.value === 'string' && msgField.value.trim()) {
        notificationMessage = msgField.value.trim();
      }
    }
  }

  return {
    guestName: (current.guestName as string) || 'Guest',
    arrivalDate: current.arrivalDate as string,
    departureDate: current.departureDate as string,
    numberOfGuests: (current.numberOfGuests as number) || 1,
    notificationMessage,
  };
}
