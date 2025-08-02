export default function Home() {
  return (
    <div className="min-h-screen bg-snowbird-blue relative overflow-hidden">
      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col">
        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Brand Name */}
            <h1 className="text-black mb-8 sm:mb-12">
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[80px] font-light leading-none tracking-tight">
                Snowbird
              </span>
              <span className="block w-full h-0.5 bg-black mt-2 sm:mt-3 md:mt-4"></span>
            </h1>
            
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