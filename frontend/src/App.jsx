import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BannerManager from './pages/admin/BannerManager';
import SectionEditor from './pages/admin/SectionEditor';
import SiteSettings from './pages/admin/SiteSettings';
import MediaLibrary from './pages/admin/MediaLibrary';
import StreamersManager from './pages/admin/StreamersManager';
import VisualEditor from './pages/admin/VisualEditor';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Visual Editor - Direct route (no layout) */}
          <Route path="/admin/visual" element={<VisualEditor />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="banners" element={<BannerManager />} />
            <Route path="sections" element={<SectionEditor />} />
            <Route path="streamers" element={<StreamersManager />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="settings" element={<SiteSettings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
