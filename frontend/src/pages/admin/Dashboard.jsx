import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bannersAPI } from '../../services/api';
import {
  Image,
  Layout,
  Users,
  Eye,
  Plus,
  Edit,
  Upload,
  TrendingUp,
  Activity
} from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalBanners: 0,
    activeBanners: 0,
    totalSections: 6, // Fixed sections count
    totalStreamers: 0,
    siteVisitors: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch banners
      const bannersResponse = await bannersAPI.getAll();
      if (bannersResponse.data.success) {
        const banners = bannersResponse.data.data;
        const activeBanners = banners.filter(b => b.active).length;
        
        setStats(prev => ({
          ...prev,
          totalBanners: banners.length,
          activeBanners: activeBanners
        }));

        // Generate recent activity from banners
        const activity = banners.slice(0, 5).map(banner => ({
          id: banner.id,
          type: 'banner',
          action: banner.active ? 'activated' : 'created',
          title: banner.title,
          time: new Date(banner.createdAt || Date.now()).toLocaleString()
        }));
        
        setRecentActivity(activity);
      }

      // In a real app, you'd fetch sections and streamers data too
      // For now, we'll use placeholder data
      setStats(prev => ({
        ...prev,
        totalStreamers: 8,
        siteVisitors: 1247
      }));
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, subValue, color, link }) => (
    <Link
      to={link}
      className={`
        bg-gray-800 rounded-xl p-6 border-2 border-transparent
        hover:border-${color}-500/50 hover:shadow-lg hover:shadow-${color}-900/20
        transition-all duration-300 group
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold mb-2">{value}</h3>
          {subValue && (
            <p className={`text-sm text-${color}-400 flex items-center gap-1`}>
              <TrendingUp className="w-4 h-4" />
              {subValue}
            </p>
          )}
        </div>
        <div className={`bg-${color}-500/10 p-3 rounded-lg group-hover:bg-${color}-500/20 transition-colors`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
      </div>
    </Link>
  );

  const QuickAction = ({ icon: Icon, label, description, link, color }) => (
    <Link
      to={link}
      className={`
        bg-gray-800 rounded-lg p-5 border border-gray-700
        hover:border-${color}-500/50 hover:bg-gray-750
        transition-all duration-200 group
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`bg-${color}-500/10 p-3 rounded-lg group-hover:bg-${color}-500/20 transition-colors`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        <div>
          <h4 className="font-semibold mb-1">{label}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Activity className="w-12 h-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Image}
          label="Total Banners"
          value={stats.totalBanners}
          subValue={`${stats.activeBanners} active`}
          color="purple"
          link="/admin/banners"
        />
        <StatCard
          icon={Layout}
          label="Active Sections"
          value={stats.totalSections}
          subValue="All configured"
          color="blue"
          link="/admin/sections"
        />
        <StatCard
          icon={Users}
          label="Total Streamers"
          value={stats.totalStreamers}
          subValue="Featured profiles"
          color="green"
          link="/admin/streamers"
        />
        <StatCard
          icon={Eye}
          label="Site Visitors"
          value={stats.siteVisitors.toLocaleString()}
          subValue="+12% this week"
          color="orange"
          link="/"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            icon={Plus}
            label="Add Banner"
            description="Create a new promotional banner"
            link="/admin/banners"
            color="purple"
          />
          <QuickAction
            icon={Edit}
            label="Edit Hero Section"
            description="Update homepage hero content"
            link="/admin/sections"
            color="blue"
          />
          <QuickAction
            icon={Upload}
            label="Upload Media"
            description="Add images, videos, or GIFs"
            link="/admin/media"
            color="green"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity to display</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="p-4 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-500/10 p-2 rounded-lg mt-1">
                        <Image className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Banner <span className="text-purple-400">{activity.title}</span> was {activity.action}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">System Status</h3>
            <p className="text-sm text-gray-400">All systems operational</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
