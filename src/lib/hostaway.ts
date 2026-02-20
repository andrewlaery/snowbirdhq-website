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

function getNZDate(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland' }).format(new Date());
}

export interface CurrentReservation {
  guestName: string;
  arrivalDate: string;
  departureDate: string;
  numberOfGuests: number;
  welcomeMessage: string | null;
}

export async function getCurrentReservation(listingId: number): Promise<CurrentReservation | null> {
  const token = await getToken();
  const today = getNZDate();

  const dateStart = new Date(today);
  dateStart.setDate(dateStart.getDate() - 30);
  const dateEnd = new Date(today);
  dateEnd.setDate(dateEnd.getDate() + 30);

  const params = new URLSearchParams({
    listingId: String(listingId),
    sortOrder: 'arrivalDate',
    startingAfter: dateStart.toISOString().split('T')[0],
    endingBefore: dateEnd.toISOString().split('T')[0],
    limit: '50',
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

  const current = reservations.find((r: Record<string, unknown>) => {
    if (!activeStatuses.includes(r.status as string)) return false;
    const arrival = r.arrivalDate as string;
    const departure = r.departureDate as string;
    return today >= arrival && today < departure;
  });

  if (!current) return null;

  let welcomeMessage: string | null = null;
  const customFields = current.customFieldValues as Record<string, unknown>[] | undefined;
  if (Array.isArray(customFields)) {
    const wmField = customFields.find(
      (f: Record<string, unknown>) => f.customFieldName === 'reservation_welcomemessage'
    );
    if (wmField && typeof wmField.value === 'string' && wmField.value.trim()) {
      welcomeMessage = wmField.value.trim();
    }
  }

  return {
    guestName: (current.guestName as string) || 'Guest',
    arrivalDate: current.arrivalDate as string,
    departureDate: current.departureDate as string,
    numberOfGuests: (current.numberOfGuests as number) || 1,
    welcomeMessage,
  };
}
