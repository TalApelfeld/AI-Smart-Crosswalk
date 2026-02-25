import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Navbar } from './components/ui';
import { Dashboard, Alerts, Crosswalks, CrosswalkDetailsPage } from './pages';
import { ToastProvider } from './components/ui';

// Global cache shared across all pages. Data fetched once is reused for 5 minutes without re-fetching.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Root component — wraps the app with the cache provider, toast notifications, and page routing.
function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
      {/* DevTools panel — visible only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
