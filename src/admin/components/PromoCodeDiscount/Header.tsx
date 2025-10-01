interface PageHeaderProp{
  promoCount: number
}
export const PageHeader: React.FC<PageHeaderProp> = ({
  promoCount = 0
}) => (
  <div className="relative mb-12 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#263b51]/5 via-[#456882]/3 to-[#CBDCEB]/8 rounded-2xl"></div>
    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-[#CBDCEB]/50 p-8 shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div>
              <h1 className="text-4xl font-bold bg-[#263b51] bg-clip-text text-transparent leading-tight">
                Promo Code Management
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-[#456882] rounded-full animate-pulse"></div>
                <span className="text-[#456882] font-medium">
                  Control Center
                </span>
              </div>
            </div>
          </div>
          <p className="text-[#456882] text-lg leading-relaxed max-w-2xl">
            Create, manage, and track promotional discount codes for your store.
            Monitor real-time usage statistics, control availability periods,
            and optimize your marketing campaigns.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-[#CBDCEB] to-[#456882]/20 rounded-2xl p-6 border border-[#CBDCEB]/50">
            <div className="text-right">
              <div className="text-2xl font-bold text-[#263b51]">{promoCount}</div>
              <div className="text-sm text-[#456882]">Active Codes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
