
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Building2, BarChart3, Coins, FileText, Settings, Menu, X,
  PlusCircle, Search, ChevronLeft, ChevronRight, Inbox, LogOut, Heart, LucideIcon, Users
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem: React.FC<{ to: string; icon: LucideIcon; label: string; collapsed: boolean; active: boolean }> = ({ 
  to, icon: Icon, label, collapsed, active 
}) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-[#EAB308] text-[#001A33] shadow-lg shadow-yellow-500/20' 
        : 'text-slate-400 hover:text-white hover:bg-white/10'
    }`}
  >
    <Icon size={20} className="shrink-0" />
    {!collapsed && <span className="font-semibold whitespace-nowrap">{label}</span>}
  </Link>
);

const Logo = ({ collapsed }: { collapsed: boolean }) => (
  <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
    {!collapsed && <span className="text-white font-bold text-xl tracking-tighter">we</span>}
    <div className="relative">
       <Heart size={collapsed ? 28 : 24} fill="#EAB308" stroke="#EAB308" className="transform -rotate-12" />
    </div>
    {!collapsed && <span className="text-white font-bold text-xl tracking-tighter">care</span>}
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Painel' },
    { to: '/items', icon: Package, label: 'Itens' },
    { to: '/entries', icon: Inbox, label: 'Entradas' },
    { to: '/exits', icon: LogOut, label: 'Doar / Saída' },
    { to: '/beneficiaries', icon: Users, label: 'Beneficiários' },
    { to: '/stock', icon: BarChart3, label: 'Estoque' },
    { to: '/financial', icon: Coins, label: 'Financeiro' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden">
      <aside 
        className={`hidden md:flex flex-col bg-[#001A33] transition-all duration-300 relative shadow-2xl ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <Logo collapsed={collapsed} />
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem key={item.to} {...item} collapsed={collapsed} active={isActive(item.to)} />
          ))}
        </nav>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-4 border-t border-white/10 hover:bg-white/5 text-slate-400 flex items-center justify-center transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span className="text-sm font-medium">Recolher</span></div>}
        </button>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-[#001A33] shadow-xl animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <Logo collapsed={false} />
              <button onClick={() => setMobileMenuOpen(false)} className="text-white"><X /></button>
            </div>
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive(item.to) ? 'bg-[#EAB308] text-[#001A33]' : 'text-slate-400'}`}>
                  <item.icon size={20} />
                  <span className="font-bold">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 hover:bg-slate-100 rounded-xl" onClick={() => setMobileMenuOpen(true)}><Menu size={24} /></button>
            <h1 className="text-lg font-bold text-[#001A33] uppercase tracking-wide">
              {menuItems.find(m => isActive(m.to))?.label || 'Início'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-slate-100 rounded-xl px-3 py-1.5 w-64 border border-slate-200">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Busca inteligente..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none" />
            </div>
            <Link to="/entries" className="bg-[#EAB308] text-[#001A33] px-4 py-2 rounded-xl hover:opacity-90 transition-all text-xs font-black uppercase shadow-sm">
              Nova Entrada
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
