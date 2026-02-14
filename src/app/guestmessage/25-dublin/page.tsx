import Image from 'next/image';
import Link from 'next/link';

export default function GuestMessage25Dublin() {
  return (
    <div
      className='min-h-screen bg-cover bg-center bg-fixed'
      style={{ backgroundImage: "url('/queenstown-bg.jpg')" }}
    >
      {/* Dark overlay for readability */}
      <div className='min-h-screen bg-black/40'>
        {/* Header */}
        <header className='bg-white/20 backdrop-blur-sm'>
          <div className='max-w-4xl mx-auto px-4 py-3'>
            <Link href='/' className='flex items-center justify-center'>
              <Image
                src='/SnowbirdHQ-trans.png'
                alt='Snowbird HQ'
                width={50}
                height={50}
                className='object-contain'
              />
              <span className='ml-3 text-xl font-semibold text-white drop-shadow-md'>
                Snowbird HQ
              </span>
            </Link>
          </div>
        </header>

        {/* Guest Message Content */}
        <main className='max-w-4xl mx-auto px-4 py-6'>
          <div className='bg-white/90 backdrop-blur-md rounded-xl p-5 shadow-2xl'>
            <h1 className='text-2xl font-bold text-gray-900 mb-3'>
              Welcome Erica &amp; Family! 🏔️
            </h1>

            {/* UPDATE YOUR MESSAGE BELOW */}
            <div className='prose text-gray-700 space-y-2'>


              <p>
                Hi Erica! We&apos;re absolutely delighted to welcome you and your two families to 25 Dublin Street for your 3-night stay in Queenstown. It&apos;s wonderful to have guests all the way from China, and we&apos;re so pleased our home caught your eye!
              </p>

              <p>
                We hope these three days give you and your group plenty of time to explore everything Queenstown has to offer while also enjoying some relaxing moments together at the property. The mountain and lake views should provide a beautiful backdrop for your family getaway.
              </p>

              <p>
                If you need anything at all during your stay, we&apos;re just a message away.
              </p>

              <p>
                Warmly,<br />
                Andrew @ Snowbird HQ
              </p>

              <h2 className='text-lg font-semibold text-gray-900 mt-4'>
                Contact Us
              </h2>
              <p>
                If you need anything during your stay, please reach out via the <strong>messaging service on your booking platform</strong> - this is the quickest way to get in touch with us.
              </p>
              <p>
                For urgent matters, you can also call us directly:
              </p>
              <ul className='list-disc pl-6 space-y-1'>
                <li>Phone: <a href='tel:+6421360695' className='text-blue-600 hover:text-blue-800'>+64 21 360 695</a></li>
                <li>Website: <a href='https://snowbirdhq.com' className='text-blue-600 hover:text-blue-800'>snowbirdhq.com</a></li>
              </ul>
            </div>
            {/* END OF MESSAGE SECTION */}
          </div>
        </main>

        {/* Footer */}
        <footer className='py-4 mt-6'>
          <div className='max-w-4xl mx-auto px-4 text-center text-white/80 text-sm'>
            <p>&copy; 2025 Snowbird HQ Property Management</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
