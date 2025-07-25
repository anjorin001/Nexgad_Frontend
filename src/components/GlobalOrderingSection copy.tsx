import Globe from "./Globe";

const GlobalOrderingSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#CBDCEB] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1B3C53] mb-6 leading-tight">
                Order From 
                <span className="block text-[#456882]">Anywhere in Nigeria</span>
              </h2>
              <p className="text-lg text-[#456882]/80 leading-relaxed mb-8">
                No matter where you are in Nigeria, NexGad brings the latest gadgets right to your doorstep. 
                From Lagos to Abuja, Kano to Port Harcourt - we deliver nationwide with trusted logistics partners.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#1B3C53] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1B3C53] mb-2">Nationwide Delivery</h3>
                  <p className="text-[#456882]/70">Fast and reliable delivery to all 36 states across Nigeria</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#456882] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1B3C53] mb-2">Quality Guaranteed</h3>
                  <p className="text-[#456882]/70">Every gadget is carefully curated and quality-checked by our admin</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#1B3C53] to-[#456882] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1B3C53] mb-2">Best Prices</h3>
                  <p className="text-[#456882]/70">Competitive pricing on authentic gadgets with transparent costs</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="bg-[#1B3C53] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#456882] transition-all duration-300 hover:shadow-xl transform hover:scale-105">
                Start Shopping Now
                <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right side - Globe */}
          <div className="relative hidden lg:block">
            <div className="aspect-square max-w-lg mx-auto">
              <Globe />
            </div>
            
            {/* Floating elements around globe */}
            <div className="absolute top-1/4 -left-4 animate-bounce">
              <div className="bg-white rounded-full p-3 shadow-lg border border-[#456882]/20">
                <svg className="w-6 h-6 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div className="absolute bottom-1/3 -right-4 animate-bounce delay-300">
              <div className="bg-white rounded-full p-3 shadow-lg border border-[#456882]/20">
                <svg className="w-6 h-6 text-[#456882]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalOrderingSection;