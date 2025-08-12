import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPolicy() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Navigation Header */}
      <header className='bg-white border-b border-gray-200'>
        <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center'>
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
            </Link>
            <div className='hidden md:flex space-x-8'>
              <Link href='/' className='text-gray-700 hover:text-gray-900'>
                Home
              </Link>
              <Link
                href='/#services'
                className='text-gray-700 hover:text-gray-900'
              >
                Services
              </Link>
              <Link
                href='/#contact'
                className='text-gray-700 hover:text-gray-900'
              >
                Contact
              </Link>
              <Link href='/terms' className='text-gray-700 hover:text-gray-900'>
                Terms
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Privacy Policy Content */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Privacy Policy
        </h1>

        <div className='prose prose-gray max-w-none'>
          <p className='text-gray-600 mb-6'>
            <strong>Effective Date: January 1, 2025</strong>
          </p>

          <p className='text-gray-600 mb-6'>
            Snowbird HQ Property Management Limited ("we," "our," or "us") is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you use our services or visit our website.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            1. Information We Collect
          </h2>

          <h3 className='text-xl font-semibold text-gray-900 mt-6 mb-3'>
            Personal Information
          </h3>
          <p className='text-gray-600 mb-4'>
            We may collect personal information that you provide directly to us,
            including:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>Name and contact information (email, phone number, address)</li>
            <li>Property details and ownership information</li>
            <li>Financial information for payment processing</li>
            <li>Guest information for booking management</li>
            <li>Communications and correspondence with us</li>
          </ul>

          <h3 className='text-xl font-semibold text-gray-900 mt-6 mb-3'>
            Automatically Collected Information
          </h3>
          <p className='text-gray-600 mb-4'>
            When you visit our website, we may automatically collect:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Website usage data and analytics</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            2. How We Use Your Information
          </h2>
          <p className='text-gray-600 mb-4'>
            We use the information we collect to:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>Provide and manage our property management services</li>
            <li>Process bookings and payments</li>
            <li>Communicate with property owners and guests</li>
            <li>
              Send service updates and marketing communications (with consent)
            </li>
            <li>Improve our services and website functionality</li>
            <li>Comply with legal obligations and regulations</li>
            <li>Protect against fraud and security threats</li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            3. Information Sharing and Disclosure
          </h2>
          <p className='text-gray-600 mb-4'>
            We may share your information with:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>
              <strong>Service Providers:</strong> Third-party vendors who assist
              in our operations (cleaning services, maintenance contractors,
              payment processors)
            </li>
            <li>
              <strong>Booking Platforms:</strong> Airbnb, Booking.com, and other
              listing platforms as necessary for property management
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect our rights
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with any
              merger, sale, or transfer of business assets
            </li>
            <li>
              <strong>With Consent:</strong> When you have given us explicit
              permission to share
            </li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            4. Data Security
          </h2>
          <p className='text-gray-600 mb-6'>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            5. Data Retention
          </h2>
          <p className='text-gray-600 mb-6'>
            We retain personal information for as long as necessary to provide
            our services, comply with legal obligations, resolve disputes, and
            enforce our agreements. When information is no longer needed, we
            will securely delete or anonymize it.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            6. Your Rights and Choices
          </h2>
          <p className='text-gray-600 mb-4'>You have the right to:</p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>Access and receive a copy of your personal information</li>
            <li>Correct or update inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            7. WhatsApp Business Communications
          </h2>
          <p className='text-gray-600 mb-6'>
            If you communicate with us via WhatsApp Business, please note that:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>
              Messages are subject to WhatsApp's privacy policy and terms of
              service
            </li>
            <li>
              We use WhatsApp Business for customer service and booking
              inquiries
            </li>
            <li>You can opt-out of WhatsApp communications at any time</li>
            <li>
              We do not share your WhatsApp contact information with third
              parties for marketing
            </li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            8. International Data Transfers
          </h2>
          <p className='text-gray-600 mb-6'>
            As we operate in New Zealand and work with international booking
            platforms, your information may be transferred to and processed in
            countries outside of New Zealand. We ensure appropriate safeguards
            are in place for such transfers.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            9. Children's Privacy
          </h2>
          <p className='text-gray-600 mb-6'>
            Our services are not directed to individuals under 18 years of age.
            We do not knowingly collect personal information from children. If
            we become aware that we have collected information from a child, we
            will delete it.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            10. Updates to This Policy
          </h2>
          <p className='text-gray-600 mb-6'>
            We may update this Privacy Policy from time to time. The updated
            version will be indicated by an updated "Effective Date" and will be
            effective as soon as it is posted. We encourage you to review this
            Privacy Policy periodically.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            11. Contact Us
          </h2>
          <p className='text-gray-600 mb-6'>
            If you have questions or concerns about this Privacy Policy or our
            privacy practices, please contact us at:
          </p>
          <div className='bg-gray-50 p-6 rounded-lg mb-6'>
            <p className='text-gray-700 font-semibold'>
              Snowbird HQ Property Management Limited
            </p>
            <p className='text-gray-600'>Email: hello@snowbirdhq.com</p>
            <p className='text-gray-600'>Phone: +6421950670</p>
            <p className='text-gray-600'>
              Address: Queenstown Central, Queenstown 9300, New Zealand
            </p>
          </div>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            12. New Zealand Privacy Act
          </h2>
          <p className='text-gray-600 mb-6'>
            This Privacy Policy is designed to comply with the New Zealand
            Privacy Act 2020. You have rights under this Act, including the
            right to access and correct your personal information. For more
            information about your privacy rights in New Zealand, visit the
            Office of the Privacy Commissioner at www.privacy.org.nz.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-8 mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <p className='text-gray-400'>
            &copy; 2025 Snowbird HQ Property Management Limited. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
