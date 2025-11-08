import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './components/auth/Login';
import { AdminBalance } from './components/admin/AdminBalance';
import { AdminTransfer } from './components/admin/AdminTransfer';
import { AdminHistory } from './components/admin/AdminHistory';
import { PlayerBalance } from './components/player/PlayerBalance';
import { PlayerTransfer } from './components/player/PlayerTransfer';
import { PlayerHistory } from './components/player/PlayerHistory';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/balance"
            element={
              <ProtectedRoute role="admin">
                <AdminBalance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transfer"
            element={
              <ProtectedRoute role="admin">
                <AdminTransfer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/history"
            element={
              <ProtectedRoute role="admin">
                <AdminHistory />
              </ProtectedRoute>
            }
          />
          
          {/* Player Routes */}
          <Route
            path="/player/balance"
            element={
              <ProtectedRoute role="player">
                <PlayerBalance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/player/transfer"
            element={
              <ProtectedRoute role="player">
                <PlayerTransfer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/player/history"
            element={
              <ProtectedRoute role="player">
                <PlayerHistory />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="bottom-center" />
      </BrowserRouter>
    </AuthProvider>
  );
}

