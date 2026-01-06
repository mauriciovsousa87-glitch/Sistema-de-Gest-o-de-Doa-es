
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ArrowRightLeft, 
  Building2, 
  BarChart3, 
  Coins, 
  FileText, 
  Settings, 
  Menu, 
  X,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Inbox,
  LogOut,
  LucideIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

// Fixed: Using React.FC to handle the reserved 'key' prop correctly and typed 'icon' as LucideIcon
interface SidebarItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  collapsed, 
  active 
}) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} className="shrink-0" />
    {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/items', icon: Package, label: 'Cadastro de Itens' },
    { to: '/entries', icon: Inbox, label: 'Entrada de Doações' },
    { to: '/exits', icon: LogOut, label: 'Saída para Instituições' },
    { to: '/institutions', icon: Building2, label: 'Instituições' },
    { to: '/stock', icon: BarChart3, label: 'Estoque' },
    { to: '/financial', icon: Coins, label: 'Financeiro' },
    { to: '/reports', icon: FileText, label: 'Relatórios' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside 
        className={`hidden md:flex flex-col border-r bg-white transition-all duration-300 relative ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-5 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
              <span className="font-bold text-slate-800 text-lg tracking-tight">GestãoDoa</span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.to}
              {...item}
              collapsed={collapsed}
              active={isActive(item.to)}
            />
          ))}
        </nav>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-4 border-t hover:bg-slate-50 flex items-center justify-center text-slate-400"
        >
          {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span>Recolher</span></div>}
        </button>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-64 h-full bg-white shadow-xl flex flex-col animate-slide-right"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 flex items-center justify-between border-b">
              <span className="font-bold text-slate-800 text-lg">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}><X /></button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive(item.to) ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 hover:bg-slate-100 rounded-md"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-slate-800 hidden sm:block">
              {menuItems.find(m => isActive(m.to))?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-3 py-1.5 w-64">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Busca global..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none"
              />
            </div>
            
            <Link to="/entries" className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
              <PlusCircle size={18} />
              Nova Entrada
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
