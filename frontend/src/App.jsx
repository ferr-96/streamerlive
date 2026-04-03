import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BannerManager from './pages/BannerManager';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/banners" element={<BannerManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
