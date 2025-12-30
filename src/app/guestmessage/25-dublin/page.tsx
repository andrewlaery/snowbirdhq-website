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
          <div className='max-w-4xl mx-auto px-4 py-6'>
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
        <main className='max-w-4xl mx-auto px-4 py-12'>
          <div className='bg-white/90 backdrop-blur-md rounded-xl p-8 shadow-2xl'>
            <h1 className='text-3xl font-bold text-gray-900 mb-6'>
              Welcome to Snowbird QT, Smith Family!
            </h1>

            {/* UPDATE YOUR MESSAGE BELOW */}
            <div className='prose prose-lg text-gray-700 space-y-4'>
              <p className='text-lg'>
                Welcome to Queenstown! We are thrilled to host your family of 5 all the way from Austin, Texas.
              </p>

              <p>
                Since this is your first time in Queenstown, we hope you fall in love with this stunning corner of New Zealand. We are here to support you if you have any questions at all during your stay.
              </p>

              <div className='bg-snowbird-blue/80 rounded-lg p-6 mt-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                  A Little Welcome Gift
                </h2>
                <p className='text-gray-800'>
                  The <strong>Wine</strong>, <strong>Chips</strong>, and <strong>Chocolate</strong> are on the house. Enjoy!
                </p>
              </div>

              <div className='bg-blue-50 rounded-lg p-6 mt-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                  First-Timer Recommendations
                </h2>
                <p className='text-gray-800 mb-3'>
                  Here are some must-do activities for your first Queenstown visit:
                </p>
                <ul className='list-disc pl-6 space-y-2 text-gray-800'>
                  <li><strong>Skyline Gondola & Luge</strong> - Iconic views and fun for the whole family</li>
                  <li><strong>TSS Earnslaw Steamship</strong> - Historic cruise on Lake Wakatipu</li>
                  <li><strong>Fergburger</strong> - Famous local burger spot (worth the queue!)</li>
                  <li><strong>Queenstown Gardens</strong> - Beautiful lakeside walk, great for families</li>
                  <li><strong>Arrowtown</strong> - Charming historic village just 20 minutes away</li>
                </ul>
              </div>

              <h2 className='text-xl font-semibold text-gray-900 mt-8'>
                Contact Us
              </h2>
              <p>
                If you need anything during your stay, please reach out via the <strong>messaging service on your booking platform</strong> - this is the quickest way to get in touch with us.
              </p>
              <p>
                For urgent matters, you can also call us directly:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Phone: <a href='tel:+6421360695' className='text-blue-600 hover:text-blue-800'>+64 21 360 695</a></li>
                <li>Website: <a href='https://snowbirdhq.com' className='text-blue-600 hover:text-blue-800'>snowbirdhq.com</a></li>
              </ul>
            </div>
            {/* END OF MESSAGE SECTION */}
          </div>
        </main>

        {/* Footer */}
        <footer className='py-6 mt-12'>
          <div className='max-w-4xl mx-auto px-4 text-center text-white/80 text-sm'>
            <p>&copy; 2025 Snowbird HQ Property Management</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
