import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BannerManager from './pages/BannerManager';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        {/* Navigation */}
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/"
                  className="flex items-center px-4 text-white hover:bg-gray-700 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/admin/banners"
                  className="flex items-center px-4 text-white hover:bg-gray-700 transition-colors"
                >
                  Banner Manager
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/banners" element={<BannerManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
