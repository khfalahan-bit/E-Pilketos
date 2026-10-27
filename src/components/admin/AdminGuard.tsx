import React from 'react';
import { Shield } from 'lucide-react';

interface AdminGuardProps {
  isAuthChecking: boolean;
  isAdminLoggedIn: boolean;
  onUnauthorizedRedirect: () => void;
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({
  isAuthChecking,
  isAdminLoggedIn,
  onUnauthorizedRedirect,
  children,
}) => {
  // 1. Kunci protected route selama pengecekan sesi berlangsung
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
        <div className="flex flex-col items-center gap-3.5 text-center max-w-xs animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center shadow-lg font-bold">
            <Shield className="w-6 h-6 text-blue-950 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Memeriksa Sesi Admin...</h3>
            <p className="text-xs text-slate-400 mt-0.5">Memvalidasi kredensial login panitia</p>
          </div>
          <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-amber-400 rounded-full animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Hanya jalankan redirect jika pengecekan telah selesai dan admin tidak terotentikasi
  if (!isAdminLoggedIn) {
    onUnauthorizedRedirect();
    return null;
  }

  // 3. Sesi valid terkonfirmasi
  return <>{children}</>;
};
