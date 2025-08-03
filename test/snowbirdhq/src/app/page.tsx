import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-snowbird-blue relative overflow-hidden">
      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col">
        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Brand Logo */}
            <div className="mb-8 sm:mb-12">
              <Image
                src="/SnowbirdHQ-trans.png"
                alt="Snowbird - Luxury Property Management"
                width={400}
                height={400}
                priority
                className="mx-auto w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-contain"
              />
            </div>
            
            {/* Main Message */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-12 sm:mb-16 md:mb-20">
              <p className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight text-balance">
                The property management you want.
              </p>
              <p className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight text-balance">
                The returns you need.
              </p>
            </div>
            
            {/* Coming Soon */}
            <p className="text-black text-sm sm:text-base md:text-lg lg:text-xl font-normal tracking-wider-xl uppercase">
              Coming Soon...
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="pb-8 sm:pb-12 px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <p className="text-black text-xs sm:text-sm md:text-base font-light opacity-70">
              Queenstown, New Zealand
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}