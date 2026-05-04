import { useState, type ReactNode } from 'react';
import { 
  Home, 
  TrendingUp, 
  ChevronRight, 
  ChevronDown, 
  ShieldCheck, 
  Settings, 
  PanelLeft
} from 'lucide-react';

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

function MenuItem({ icon, label, isActive, hasSubmenu, isOpen, isCollapsed, onClick, children }: MenuItemProps) {
  return (
    <div>
      <div 
        onClick={onClick}
        title={isCollapsed ? label : ''}
        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'} py-2.5 cursor-pointer transition-all duration-300 group ${
          isActive ? 'bg-[#E6F0F9] text-[#00529C] border-l-4 border-[#00529C]' : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
        }`}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full`}>
          <span className={`${isActive ? 'text-[#00529C]' : 'text-gray-500 group-hover:text-gray-700'}`}>
            {icon}
          </span>
          {!isCollapsed && <span className="text-[13px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300">{label}</span>}
        </div>
        {hasSubmenu && !isCollapsed && (
          <span className="text-gray-400">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
      </div>
      {isOpen && !isCollapsed && children}
    </div>
  );
}

interface SidebarProps {
  activeView: 'export' | 'list' | 'pending' | 'create_detail';
  onViewChange: (view: 'export' | 'list' | 'pending') => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [openGroups, setOpenGroups] = useState<string[]>(['hang']);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleGroup = (id: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenGroups([id]);
      return;
    }
    setOpenGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const isListViewActive = activeView === 'list' || activeView === 'create_detail';

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 h-full flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out`}>
      <div className={`p-2 border-b border-gray-100 flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-gray-100 rounded text-gray-500 flex items-center justify-center transition-colors"
        >
           <PanelLeft size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 scrollbar-none">
        <MenuItem 
          icon={<Home size={18} />} 
          label="Dashboard" 
          isCollapsed={isCollapsed}
        />

        <MenuItem 
          icon={<TrendingUp size={18} />} 
          label="Nhóm báo cáo Dược" 
          hasSubmenu 
          isOpen={openGroups.includes('duoc')}
          isCollapsed={isCollapsed}
          onClick={() => toggleGroup('duoc')}
        />

        <MenuItem 
          icon={<ShieldCheck size={18} />} 
          label="Nhóm báo cáo Hãng" 
          hasSubmenu 
          isActive
          isOpen={openGroups.includes('hang')}
          isCollapsed={isCollapsed}
          onClick={() => toggleGroup('hang')}
        >
          {!isCollapsed && (
            <div className="bg-gray-50/50">
              <div 
                onClick={() => onViewChange('export')}
                className={`pl-12 py-2 text-[13px] cursor-pointer transition-colors ${
                  activeView === 'export' ? 'text-[#00529C] font-semibold bg-[#F0F7FF]' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Báo cáo Hãng
              </div>
              <div 
                onClick={() => onViewChange('list')}
                className={`pl-12 py-2 text-[13px] cursor-pointer transition-colors ${
                  isListViewActive ? 'text-[#00529C] font-semibold bg-[#F0F7FF]' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Danh sách Đề nghị báo cáo
              </div>
              <div 
                onClick={() => onViewChange('pending')}
                className={`pl-12 py-2 text-[13px] cursor-pointer transition-colors ${
                  activeView === 'pending' ? 'text-[#00529C] font-semibold bg-[#F0F7FF]' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Danh sách Đề nghị báo cáo chờ duyệt
              </div>
            </div>
          )}
        </MenuItem>

        <MenuItem 
          icon={<Settings size={18} />} 
          label="Cài đặt" 
          hasSubmenu
          isCollapsed={isCollapsed}
        />
      </div>
    </aside>
  );
}
