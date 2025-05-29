
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ComparisonProvider } from '@/context/ComparisonContext';
import { CartProvider } from '@/context/CartContext';
import { RoomProvider } from '@/context/RoomContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import AppRoutes from '@/routes/AppRoutes';
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Main App component that handles routing
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
      {isAuthenticated ? (
        <Route path="/*" element={<AppRoutes />} />
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <NotificationProvider>
              <FavoritesProvider>
                <ComparisonProvider>
                  <CartProvider>
                    <RoomProvider>
                      <AppContent />
                      <Toaster />
                    </RoomProvider>
                  </CartProvider>
                </ComparisonProvider>
              </FavoritesProvider>
            </NotificationProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
