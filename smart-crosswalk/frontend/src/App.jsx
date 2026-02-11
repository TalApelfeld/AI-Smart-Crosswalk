import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout';
import { Dashboard, Alerts, Crosswalks, CrosswalkDetailsPage } from './pages';
import { ToastProvider } from './components/ui';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/crosswalks" element={<Crosswalks />} />
            <Route path="/crosswalks/:id" element={<CrosswalkDetailsPage />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;
