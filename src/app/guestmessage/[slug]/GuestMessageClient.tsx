'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ReservationData {
  guestName: string;
  arrivalDate: string;
  departureDate: string;
  numberOfGuests: number;
  notificationMessage: string | null;
}

interface ApiResponse {
  property: { slug: string; name: string; address: string };
  reservation: ReservationData | null;
}

const POLL_INTERVAL = 10 * 60 * 1000; // 10 minutes

export default function GuestMessageClient({
  slug,
  propertyAddress,
}: {
  slug: string;
  propertyAddress: string;
}) {
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/guestmessage/${slug}`);
        if (!res.ok) return;
        const data: ApiResponse = await res.json();
        setReservation(data.reservation);
      } catch {
        // Silently fail — TV will show fallback
      } finally {
        setLoaded(true);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [slug]);

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/queenstown-bg.jpg')" }}
    >
      <div className="flex h-screen flex-col bg-black/40">
        {/* Header */}
        <header className="bg-white/20 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-3">
            <Image
              src="/SnowbirdHQ-trans.png"
              alt="Snowbird HQ"
              width={50}
              height={50}
              className="object-contain"
            />
            <span className="ml-3 text-xl font-semibold text-white drop-shadow-md">
              Snowbird HQ
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-1 items-center justify-center px-4">
          <div
            className={`w-full max-w-4xl rounded-xl bg-white/90 p-6 shadow-2xl backdrop-blur-md transition-opacity duration-700 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {reservation ? (
              <ActiveGuest reservation={reservation} />
            ) : (
              <NoGuest propertyAddress={propertyAddress} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4">
          <div className="mx-auto max-w-4xl px-4 text-center text-sm text-white/80">
            <p>&copy; {new Date().getFullYear()} Snowbird HQ Property Management</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ActiveGuest({ reservation }: { reservation: ReservationData }) {
  return (
    <>
      <h1 className="mb-3 text-2xl font-bold text-gray-900">
        Welcome {reservation.guestName.split(' ')[0]}!
      </h1>
      <div className="prose text-gray-700 space-y-2">
        {reservation.notificationMessage ? (
          <p>{reservation.notificationMessage}</p>
        ) : (
          <p>
            We&apos;re delighted to have you staying with us in Queenstown.
            We hope you have a wonderful stay and please don&apos;t hesitate to
            reach out if you need anything at all.
          </p>
        )}

        <p>
          Warmly,
          <br />
          Andrew @ Snowbird HQ
        </p>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">Contact Us</h2>
        <p>
          If you need anything during your stay, please reach out via the{' '}
          <strong>messaging service on your booking platform</strong> — this is
          the quickest way to get in touch with us.
        </p>
        <p>For urgent matters, you can also call us directly:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Phone:{' '}
            <a href="tel:+6421360695" className="text-blue-600 hover:text-blue-800">
              +64 21 360 695
            </a>
          </li>
          <li>
            Website:{' '}
            <a href="https://snowbirdhq.com" className="text-blue-600 hover:text-blue-800">
              snowbirdhq.com
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

function NoGuest({ propertyAddress }: { propertyAddress: string }) {
  return (
    <div className="text-center">
      <h1 className="mb-3 text-3xl font-bold text-gray-900">Welcome to Queenstown</h1>
      <p className="text-lg text-gray-600">{propertyAddress}</p>
      <p className="mt-4 text-gray-500">Managed by Snowbird HQ</p>
    </div>
  );
}
