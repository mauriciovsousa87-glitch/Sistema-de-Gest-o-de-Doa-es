
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppProvider, useAppStore } from './store';
import Dashboard from './pages/Dashboard';
import Entries from './pages/Entries';
import Stock from './pages/Stock';
import Institutions from './pages/Institutions';
import Exits from './pages/Exits';
import Financial from './pages/Financial';
import { AlertCircle, Loader2 } from 'lucide-react';

const LoadingScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAppStore();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium italic">Sincronizando com o Supabase...</p>
      </div>
    );
  }

  return <>{children}</>;
};

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400 p-12 text-center">
    <div className="bg-slate-100 p-6 rounded-full mb-4">
       <AlertCircle size={48} />
    </div>
    <h2 className="text-2xl font-bold text-slate-700">{title}</h2>
    <p>Esta funcionalidade está sendo preparada para o sistema.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <LoadingScreen>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/entries" element={<Entries />} />
              <Route path="/exits" element={<Exits />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/institutions" element={<Institutions />} />
              <Route path="/financial" element={<Financial />} />
              
              <Route path="/items" element={<PlaceholderPage title="Cadastro de Itens" />} />
              <Route path="/reports" element={<PlaceholderPage title="Relatórios / Exportar" />} />
              <Route path="/settings" element={<PlaceholderPage title="Configurações" />} />
            </Routes>
          </Layout>
        </Router>
      </LoadingScreen>
    </AppProvider>
  );
};

export default App;
