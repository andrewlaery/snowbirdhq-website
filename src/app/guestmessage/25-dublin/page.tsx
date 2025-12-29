import Image from 'next/image';
import Link from 'next/link';

export default function GuestMessage25Dublin() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <header className='bg-snowbird-blue'>
        <div className='max-w-4xl mx-auto px-4 py-6'>
          <Link href='/' className='flex items-center justify-center'>
            <Image
              src='/SnowbirdHQ-trans.png'
              alt='Snowbird HQ'
              width={50}
              height={50}
              className='object-contain'
            />
            <span className='ml-3 text-xl font-semibold text-gray-900'>
              Snowbird HQ
            </span>
          </Link>
        </div>
      </header>

      {/* Guest Message Content */}
      <main className='max-w-4xl mx-auto px-4 py-12'>
        <div className='bg-gray-50 rounded-lg p-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-6'>
            Welcome to 25 Dublin Street
          </h1>

          {/* UPDATE YOUR MESSAGE BELOW */}
          <div className='prose prose-lg text-gray-700 space-y-4'>
            <p>
              Welcome! We hope you have a wonderful stay at our property.
            </p>

            <h2 className='text-xl font-semibold text-gray-900 mt-8'>
              Important Information
            </h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>WiFi Network: <strong>TBC</strong> | Password: <strong>TBC</strong></li>
              <li>Check-out time: 10:00 AM</li>
              <li>Rubbish collection: TBC</li>
            </ul>

            <h2 className='text-xl font-semibold text-gray-900 mt-8'>
              Contact Us
            </h2>
            <p>
              If you need anything during your stay, please don't hesitate to reach out:
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Phone: <a href='tel:+6421950670' className='text-blue-600 hover:text-blue-800'>+64 21 950 670</a></li>
              <li>Email: <a href='mailto:hello@snowbirdhq.com' className='text-blue-600 hover:text-blue-800'>hello@snowbirdhq.com</a></li>
            </ul>
          </div>
          {/* END OF MESSAGE SECTION */}
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-gray-100 py-6 mt-12'>
        <div className='max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm'>
          <p>&copy; 2025 Snowbird HQ Property Management</p>
        </div>
      </footer>
    </div>
  );
}
