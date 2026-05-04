import { Bell, User, LayoutGrid, ChevronDown } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="h-12 bg-[#212529] text-white flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-8 h-full">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col leading-none font-bold italic">
            MOCKUP UI
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 h-full text-[13px] font-medium">
          {['Sản phẩm', 'Bán hàng', 'Kho', 'Vận chuyển', 'Báo cáo', 'Cấu hình', 'Hệ thống', 'Ứng dụng'].map((item) => (
            <div
              key={item}
              className={`h-full flex items-center px-1 cursor-pointer transition-colors hover:text-blue-400 relative ${
                item === 'Báo cáo' ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-white text-white' : 'text-gray-300'
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-1 hover:bg-white/10 rounded-full text-gray-300 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#212529]"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1 px-2 rounded h-full">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <User size={18} />
          </div>
          <span className="text-[13px] text-gray-200">test@fpt.com</span>
        </div>
      </div>
    </nav>
  );
}
