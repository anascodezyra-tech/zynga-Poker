import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0E141B]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar role="admin" />
      </div>
      
      {/* Main Content */}
      <div className="md:ml-64 min-h-screen">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileNav role="admin" />
      </div>
    </div>
  );
}

