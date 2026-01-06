
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppProvider, useAppStore } from './store';
import Dashboard from './pages/Dashboard';
import Entries from './pages/Entries';
import Stock from './pages/Stock';
import Beneficiaries from './pages/Beneficiaries'; // Renomeado
import Exits from './pages/Exits';
import Financial from './pages/Financial';
import Items from './pages/Items';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAppStore();
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#001A33]">
        <Loader2 className="w-12 h-12 text-[#EAB308] animate-spin mb-4" />
        <p className="text-white font-black italic tracking-widest uppercase text-xs">we care • sincronizando</p>
      </div>
    );
  }
  return <>{children}</>;
};

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
              <Route path="/beneficiaries" element={<Beneficiaries />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/items" element={<Items />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Layout>
        </Router>
      </LoadingScreen>
    </AppProvider>
  );
};

export default App;
