import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Navigation Header */}
      <header className='bg-white border-b border-gray-200'>
        <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <Image
                src='/SnowbirdHQ-trans.png'
                alt='Snowbird HQ Property Management'
                width={40}
                height={40}
                className='object-contain'
              />
              <span className='ml-3 text-xl font-semibold text-gray-900'>
                Snowbird HQ Property Management
              </span>
            </div>
            <div className='hidden md:flex space-x-8'>
              <a href='#services' className='text-gray-700 hover:text-gray-900'>
                Services
              </a>
              <a href='#about' className='text-gray-700 hover:text-gray-900'>
                About
              </a>
              <a href='#contact' className='text-gray-700 hover:text-gray-900'>
                Contact
              </a>
              <Link
                href='/privacy-policy'
                className='text-gray-700 hover:text-gray-900'
              >
                Privacy
              </Link>
              <Link href='/terms' className='text-gray-700 hover:text-gray-900'>
                Terms
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section with Business Identity */}
      <section className='bg-snowbird-blue'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
          <div className='text-center'>
            <Image
              src='/SnowbirdHQ-trans.png'
              alt='Snowbird HQ - Luxury Property Management'
              width={200}
              height={200}
              priority
              className='mx-auto mb-8 object-contain'
            />
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
              Snowbird HQ Property Management
            </h1>
            <p className='text-xl md:text-2xl text-gray-700 mb-4'>
              Premium Short-Term Rental Management in Queenstown, New Zealand
            </p>
            <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
              Maximizing returns for luxury property owners through professional
              management, strategic pricing, and exceptional guest experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id='services' className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>
            Our Property Management Services
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <h3 className='text-xl font-semibold mb-3'>
                Full-Service Management
              </h3>
              <p className='text-gray-600'>
                Complete end-to-end management of your luxury property including
                guest communications, check-ins, cleaning coordination, and
                maintenance oversight.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <h3 className='text-xl font-semibold mb-3'>
                Revenue Optimization
              </h3>
              <p className='text-gray-600'>
                Dynamic pricing strategies, professional photography, and
                multi-platform listings to maximize your property's earning
                potential.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <h3 className='text-xl font-semibold mb-3'>Guest Experience</h3>
              <p className='text-gray-600'>
                24/7 guest support, local recommendations, and premium amenities
                to ensure 5-star reviews and repeat bookings.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <h3 className='text-xl font-semibold mb-3'>Property Care</h3>
              <p className='text-gray-600'>
                Regular inspections, preventative maintenance, and trusted
                vendor network to protect and maintain your investment.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <h3 className='text-xl font-semibold mb-3'>
                Financial Reporting
              </h3>
              <p className='text-gray-600'>
                Transparent monthly statements, expense tracking, and annual tax
                documentation for complete financial clarity.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <h3 className='text-xl font-semibold mb-3'>
                Marketing & Listings
              </h3>
              <p className='text-gray-600'>
                Professional listing creation across Airbnb, Booking.com, and
                direct booking channels with SEO optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id='about' className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              About Snowbird HQ
            </h2>
            <p className='text-lg text-gray-600 mb-6'>
              Snowbird HQ Property Management specializes in luxury short-term
              rental management in Queenstown, New Zealand. We partner with
              property owners to deliver exceptional returns while maintaining
              the highest standards of property care and guest satisfaction.
            </p>
            <p className='text-lg text-gray-600 mb-6'>
              Our team combines local market expertise with cutting-edge
              technology to optimize every aspect of your property's
              performance. From dynamic pricing algorithms to personalized guest
              experiences, we ensure your property achieves its full potential.
            </p>
            <p className='text-lg text-gray-600'>
              With a focus on properties commanding premium nightly rates, we
              understand the unique requirements of luxury vacation rentals and
              the discerning guests they attract.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>
            Contact Us
          </h2>
          <div className='max-w-2xl mx-auto'>
            <div className='bg-white rounded-lg shadow-sm p-8'>
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Business Name
                  </h3>
                  <p className='text-gray-600'>
                    Snowbird HQ Property Management Limited
                  </p>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Email
                  </h3>
                  <a
                    href='mailto:hello@snowbirdhq.com'
                    className='text-blue-600 hover:text-blue-800'
                  >
                    hello@snowbirdhq.com
                  </a>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Phone
                  </h3>
                  <a
                    href='tel:+64212345678'
                    className='text-blue-600 hover:text-blue-800'
                  >
                    +64 21 234 5678
                  </a>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Office Address
                  </h3>
                  <p className='text-gray-600'>
                    Queenstown Central
                    <br />
                    Queenstown 9300
                    <br />
                    New Zealand
                  </p>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Business Hours
                  </h3>
                  <p className='text-gray-600'>
                    Monday - Friday: 9:00 AM - 5:00 PM NZST
                    <br />
                    Emergency Support: 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-3 gap-8'>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Snowbird HQ</h3>
              <p className='text-gray-400'>
                Premium property management for luxury short-term rentals in
                Queenstown, New Zealand.
              </p>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
              <ul className='space-y-2'>
                <li>
                  <a
                    href='#services'
                    className='text-gray-400 hover:text-white'
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a href='#about' className='text-gray-400 hover:text-white'>
                    About
                  </a>
                </li>
                <li>
                  <a href='#contact' className='text-gray-400 hover:text-white'>
                    Contact
                  </a>
                </li>
                <li>
                  <Link
                    href='/privacy-policy'
                    className='text-gray-400 hover:text-white'
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href='/terms'
                    className='text-gray-400 hover:text-white'
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Legal</h3>
              <ul className='space-y-2'>
                <li className='text-gray-400'>
                  Registered Business: Snowbird HQ Property Management Limited
                </li>
                <li className='text-gray-400'>NZBN: 9429049773563</li>
                <li className='text-gray-400'>GST: 136-255-397</li>
              </ul>
            </div>
          </div>
          <div className='mt-8 pt-8 border-t border-gray-800 text-center text-gray-400'>
            <p>
              &copy; 2025 Snowbird HQ Property Management Limited. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
