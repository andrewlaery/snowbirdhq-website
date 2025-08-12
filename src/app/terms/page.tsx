import Link from 'next/link';
import Image from 'next/image';

export default function TermsOfService() {
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
              <Link
                href='/privacy-policy'
                className='text-gray-700 hover:text-gray-900'
              >
                Privacy
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Terms of Service Content */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Terms of Service
        </h1>

        <div className='prose prose-gray max-w-none'>
          <p className='text-gray-600 mb-6'>
            <strong>Effective Date: January 1, 2025</strong>
          </p>

          <p className='text-gray-600 mb-6'>
            These Terms of Service ("Terms") govern your use of the services
            provided by Snowbird HQ Property Management ("Snowbird HQ,"
            "we," "our," or "us"), a company registered in New Zealand (NZBN:
            9429049773563). By engaging our services, you agree to be bound by
            these Terms.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            1. Services Provided
          </h2>
          <p className='text-gray-600 mb-6'>
            Snowbird HQ provides comprehensive property management services for
            short-term rental properties in Queenstown, New Zealand, including
            but not limited to:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>Property listing and marketing across multiple platforms</li>
            <li>Guest communication and booking management</li>
            <li>Property maintenance and cleaning coordination</li>
            <li>Revenue optimization and pricing strategies</li>
            <li>Financial reporting and accounting services</li>
            <li>24/7 guest support services</li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            2. Property Owner Obligations
          </h2>
          <p className='text-gray-600 mb-4'>
            As a property owner engaging our services, you agree to:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>Provide accurate and complete property information</li>
            <li>Maintain adequate insurance coverage for your property</li>
            <li>
              Ensure your property complies with all local regulations and
              safety standards
            </li>
            <li>
              Authorize us to act on your behalf for property management
              activities
            </li>
            <li>
              Pay all fees and charges as outlined in your management agreement
            </li>
            <li>
              Maintain the property in good condition suitable for guest
              occupancy
            </li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            3. Management Agreement
          </h2>
          <p className='text-gray-600 mb-6'>
            These Terms supplement the individual Property Management Agreement
            executed between Snowbird HQ and each property owner. In case of
            conflict, the specific Management Agreement prevails. The Management
            Agreement details:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>Commission structure and payment terms</li>
            <li>Specific services included</li>
            <li>Term duration and termination conditions</li>
            <li>Property-specific requirements and arrangements</li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            4. Fees and Payment
          </h2>
          <p className='text-gray-600 mb-6'>Our fee structure includes:</p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>Management commission as specified in your agreement</li>
            <li>Pass-through costs for cleaning, maintenance, and repairs</li>
            <li>Marketing and photography fees (if applicable)</li>
            <li>Guest service fees (charged to guests, not property owners)</li>
          </ul>
          <p className='text-gray-600 mb-6'>
            All fees are subject to GST where applicable. Payment terms and
            schedules are detailed in your individual Management Agreement.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            5. Booking and Cancellation Policies
          </h2>
          <p className='text-gray-600 mb-6'>
            We manage bookings according to agreed-upon policies, which may
            include:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>
              Platform-specific cancellation policies (Airbnb, Booking.com,
              etc.)
            </li>
            <li>Minimum stay requirements</li>
            <li>Seasonal pricing adjustments</li>
            <li>Security deposit handling</li>
            <li>Guest screening procedures</li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            6. Property Access and Maintenance
          </h2>
          <p className='text-gray-600 mb-6'>
            By engaging our services, you grant us and our authorized
            representatives access to your property for:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>Regular cleaning and maintenance</li>
            <li>Emergency repairs and guest assistance</li>
            <li>Property inspections and photography</li>
            <li>Coordinating with service providers and contractors</li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            7. Liability and Indemnification
          </h2>
          <p className='text-gray-600 mb-6'>
            <strong>Limitation of Liability:</strong> To the maximum extent
            permitted by law, Snowbird HQ's liability is limited to the
            management fees received for the affected period. We are not liable
            for:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>Acts or omissions of guests or third parties</li>
            <li>Normal wear and tear of property</li>
            <li>Loss of bookings due to market conditions</li>
            <li>Force majeure events</li>
          </ul>
          <p className='text-gray-600 mb-6'>
            <strong>Indemnification:</strong> You agree to indemnify and hold
            Snowbird HQ harmless from claims arising from property defects,
            non-compliance with regulations, or breach of these Terms.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            8. Intellectual Property
          </h2>
          <p className='text-gray-600 mb-6'>
            All content created by Snowbird HQ, including property descriptions,
            photographs, and marketing materials, remains our intellectual
            property. You are granted a license to use such materials solely for
            promoting your property while under our management.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            9. Confidentiality
          </h2>
          <p className='text-gray-600 mb-6'>
            Both parties agree to maintain confidentiality regarding proprietary
            information, including but not limited to:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>Pricing strategies and revenue data</li>
            <li>Guest information and booking details</li>
            <li>Business methods and operational procedures</li>
            <li>Financial information and reports</li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            10. Termination
          </h2>
          <p className='text-gray-600 mb-6'>
            Either party may terminate the management relationship as specified
            in the Management Agreement. Upon termination:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>
              We will honor existing confirmed bookings unless otherwise agreed
            </li>
            <li>Final accounting and settlement will occur within 30 days</li>
            <li>Property access and materials will be returned</li>
            <li>Obligations regarding confidentiality survive termination</li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            11. Dispute Resolution
          </h2>
          <p className='text-gray-600 mb-6'>
            Any disputes arising from these Terms or our services shall be:
          </p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>First addressed through good faith negotiation</li>
            <li>
              If unresolved, submitted to mediation in Queenstown, New Zealand
            </li>
            <li>Finally resolved through arbitration under New Zealand law</li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            12. Governing Law
          </h2>
          <p className='text-gray-600 mb-6'>
            These Terms are governed by the laws of New Zealand. Any legal
            proceedings shall be brought exclusively in the courts of New
            Zealand.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            13. Compliance and Regulations
          </h2>
          <p className='text-gray-600 mb-6'>We operate in compliance with:</p>
          <ul className='list-disc pl-6 text-gray-600 mb-6'>
            <li>New Zealand accommodation and tourism regulations</li>
            <li>Queenstown Lakes District Council requirements</li>
            <li>Health and safety standards</li>
            <li>Fair trading and consumer protection laws</li>
            <li>Privacy Act 2020 requirements</li>
          </ul>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            14. WhatsApp Business Communications
          </h2>
          <p className='text-gray-600 mb-6'>
            We may use WhatsApp Business for communications. By providing your
            phone number, you consent to receive service-related messages via
            WhatsApp. You may opt-out at any time by notifying us.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            15. Amendments
          </h2>
          <p className='text-gray-600 mb-6'>
            We reserve the right to modify these Terms with 30 days notice to
            property owners. Continued use of our services after the effective
            date constitutes acceptance of the modified Terms.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            16. Entire Agreement
          </h2>
          <p className='text-gray-600 mb-6'>
            These Terms, together with your Management Agreement and Privacy
            Policy, constitute the entire agreement between you and Snowbird HQ
            regarding our property management services.
          </p>

          <h2 className='text-2xl font-semibold text-gray-900 mt-8 mb-4'>
            17. Contact Information
          </h2>
          <p className='text-gray-600 mb-6'>
            For questions about these Terms or our services, please contact us:
          </p>
          <div className='bg-gray-50 p-6 rounded-lg mb-6'>
            <p className='text-gray-700 font-semibold'>
              Snowbird HQ Property Management
            </p>
            <p className='text-gray-600'>Email: hello@snowbirdhq.com</p>
            <p className='text-gray-600'>Phone: +6421950670</p>
            <p className='text-gray-600'>
              Address: 85 Beach Street, Queenstown 9300, New Zealand
            </p>
            <p className='text-gray-600'>NZBN: 9429049773563</p>
            <p className='text-gray-600'>GST: 136-255-397</p>
          </div>

          <p className='text-gray-600 italic mt-8'>
            By engaging Snowbird HQ Property Management's services, you
            acknowledge that you have read, understood, and agree to be bound by
            these Terms of Service.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-8 mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <p className='text-gray-400'>
            &copy; 2025 Snowbird HQ Property Management. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
