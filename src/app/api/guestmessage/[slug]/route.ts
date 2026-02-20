import { NextResponse } from 'next/server';
import { getProperty } from '@/data/properties';
import { getCurrentReservation } from '@/lib/hostaway';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const property = getProperty(slug);

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  if (!process.env.HOSTAWAY_CLIENT_ID || !process.env.HOSTAWAY_CLIENT_SECRET) {
    return NextResponse.json({
      property: { slug: property.slug, name: property.name, address: property.address },
      reservation: null,
    });
  }

  try {
    const reservation = await getCurrentReservation(property.hostawayId);
    return NextResponse.json({
      property: { slug: property.slug, name: property.name, address: property.address },
      reservation,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch reservation data', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }
}
