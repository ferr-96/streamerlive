import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Layout,
  Settings,
  Images,
  Users,
  Menu,
  X,
  Home,
  ChevronLeft
} from 'lucide-react';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/banners', icon: Image, label: 'Banners' },
    { path: '/admin/sections', icon: Layout, label: 'Section Editor' },
    { path: '/admin/streamers', icon: Users, label: 'Streamers' },
    { path: '/admin/media', icon: Images, label: 'Media Library' },
    { path: '/admin/settings', icon: Settings, label: 'Site Settings' },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 p-4 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl font-bold text-purple-400">StreamerLive Admin</h1>
        </div>
        <Link to="/" className="text-gray-400 hover:text-white transition-colors">
          <Home className="w-5 h-5" />
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-gray-800 border-r border-gray-700 z-40
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo & Header */}
        <div className="p-6 border-b border-gray-700 hidden lg:flex items-center justify-between">
          <div className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <h1 className="text-2xl font-bold text-purple-400">StreamerLive</h1>
            <p className="text-sm text-gray-400">Admin Dashboard</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${!sidebarOpen && 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 mt-16 lg:mt-0">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${active
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                      ${!sidebarOpen && 'lg:justify-center'}
                    `}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Back to Site Link */}
        <div className={`absolute bottom-6 left-4 right-4 ${!sidebarOpen && 'lg:left-2 lg:right-2'}`}>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
              Back to Site
            </span>
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300 pt-20 lg:pt-0
          ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
        `}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
