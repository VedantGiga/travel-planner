import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, MapPin, TrendingUp, Camera, Plus, ThumbsUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { auth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const SafetyHub = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showScamCheck, setShowScamCheck] = useState(false);
  const [location, setLocation] = useState('');
  const [scamAnalysis, setScamAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [newReport, setNewReport] = useState({
    type: 'SCAM',
    title: '',
    description: '',
    location: '',
    latitude: 0,
    longitude: 0,
    severity: 'Medium'
  });

  const [scamCheck, setScamCheck] = useState({
    description: '',
    amount: '',
    location: '',
    category: 'Taxi'
  });

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchNearbyReports(position.coords.latitude, position.coords.longitude);
      });
    }
  }, []);

  const fetchNearbyReports = async (lat, lng) => {
    try {
      const token = auth.getToken();
      const response = await fetch(`${API_BASE}/safety/nearby?lat=${lat}&lng=${lng}&radius=20`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleScamCheck = async () => {
    try {
      setLoading(true);
      const token = auth.getToken();
      const response = await fetch(`${API_BASE}/safety/analyze-scam`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scamCheck)
      });

      if (response.ok) {
        const data = await response.json();
        setScamAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Error analyzing scam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const token = auth.getToken();
          const response = await fetch(`${API_BASE}/safety/report`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...newReport,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          });

          if (response.ok) {
            const report = await response.json();
            setReports([report, ...reports]);
            setShowReportModal(false);
            setNewReport({
              type: 'SCAM',
              title: '',
              description: '',
              location: '',
              latitude: 0,
              longitude: 0,
              severity: 'Medium'
            });
          }
        });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const token = auth.getToken();
      await fetch(`${API_BASE}/safety/upvote/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReports(reports.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'from-red-500 to-red-700';
      case 'High': return 'from-orange-500 to-orange-700';
      case 'Medium': return 'from-yellow-500 to-yellow-700';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      SCAM: '🚨',
      UNSAFE_AREA: '⚠️',
      FAKE_GUIDE: '🎭',
      TAXI_FRAUD: '🚕',
      OVERPRICING: '💰',
      TOURIST_TRAP: '🪤',
      AGGRESSIVE_VENDOR: '😠'
    };
    return icons[type] || '⚠️';
  };

  if (!auth.isAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#fcaa13] to-[#ef420f] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">🛡️ Travel Safety Hub</h1>
              <p className="text-white/90 text-lg">AI-Powered Scam Detection & Real-Time Safety Alerts</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowScamCheck(true)} className="bg-white text-[#ef420f] hover:bg-gray-100">
                <Shield className="h-4 w-4 mr-2" />
                Check for Scam
              </Button>
              <Button onClick={() => setShowReportModal(true)} className="bg-black text-white hover:bg-gray-900">
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#111111] border-b border-gray-800 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'reports', label: 'Safety Reports', icon: AlertTriangle },
              { id: 'map', label: 'Danger Map', icon: MapPin }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-[#fcaa13] text-[#fcaa13]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111111] rounded-2xl border border-gray-800 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getSeverityColor(report.severity)} flex items-center justify-center text-3xl`}>
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white">{report.title}</h3>
                        <p className="text-sm text-gray-400">{report.location} • {new Date(report.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getSeverityColor(report.severity)} text-white`}>
                        {report.severity}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{report.description}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleUpvote(report.id)}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#fcaa13] transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{report.upvotes}</span>
                      </button>
                      <span className="text-sm text-gray-500">Reported by {report.user?.name || 'Anonymous'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'map' && (
          <div className="bg-[#111111] rounded-2xl border border-gray-800 p-8 text-center">
            <MapPin className="h-16 w-16 text-[#fcaa13] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Interactive Safety Map</h3>
            <p className="text-gray-400">Heatmap visualization coming soon with geo-tagged danger zones</p>
          </div>
        )}
      </div>

      {/* Scam Check Modal */}
      {showScamCheck && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] rounded-2xl border border-gray-800 w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">🔍 AI Scam Detector</h2>
              <p className="text-gray-400 mt-1">Get instant AI analysis of potential scams</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Category</label>
                <select
                  value={scamCheck.category}
                  onChange={(e) => setScamCheck({ ...scamCheck, category: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white"
                >
                  <option>Taxi</option>
                  <option>Restaurant</option>
                  <option>Tour Guide</option>
                  <option>Market/Shopping</option>
                  <option>Hotel</option>
                  <option>Other</option>
                </select>
              </div>
              <Input
                placeholder="Location"
                value={scamCheck.location}
                onChange={(e) => setScamCheck({ ...scamCheck, location: e.target.value })}
                className="bg-[#1a1a1a] border-gray-800 text-white"
              />
              <Input
                placeholder="Amount charged (optional)"
                value={scamCheck.amount}
                onChange={(e) => setScamCheck({ ...scamCheck, amount: e.target.value })}
                className="bg-[#1a1a1a] border-gray-800 text-white"
              />
              <Textarea
                placeholder="Describe the situation..."
                value={scamCheck.description}
                onChange={(e) => setScamCheck({ ...scamCheck, description: e.target.value })}
                className="min-h-[120px] bg-[#1a1a1a] border-gray-800 text-white"
              />

              {scamAnalysis && (
                <div className={`p-4 rounded-xl bg-gradient-to-r ${
                  scamAnalysis.riskLevel === 'Critical' || scamAnalysis.riskLevel === 'High'
                    ? 'from-red-500/20 to-orange-500/20 border border-red-500/50'
                    : 'from-green-500/20 to-blue-500/20 border border-green-500/50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{scamAnalysis.isScam === 'Yes' ? '🚨' : scamAnalysis.isScam === 'Maybe' ? '⚠️' : '✅'}</span>
                    <span className="font-bold text-white text-lg">
                      {scamAnalysis.isScam === 'Yes' ? 'Likely a Scam!' : scamAnalysis.isScam === 'Maybe' ? 'Suspicious Activity' : 'Seems Safe'}
                    </span>
                    <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
                      scamAnalysis.riskLevel === 'Critical' ? 'bg-red-500' :
                      scamAnalysis.riskLevel === 'High' ? 'bg-orange-500' :
                      scamAnalysis.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    } text-white`}>
                      {scamAnalysis.riskLevel} Risk
                    </span>
                  </div>
                  <p className="text-gray-200 mb-3">{scamAnalysis.explanation}</p>
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-sm text-gray-300"><strong className="text-white">Recommendation:</strong> {scamAnalysis.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <Button onClick={() => { setShowScamCheck(false); setScamAnalysis(null); }} variant="outline" className="border-gray-800 text-gray-300">
                Close
              </Button>
              <Button onClick={handleScamCheck} disabled={!scamCheck.description || loading} className="bg-[#fcaa13] hover:bg-[#fb6b10] text-white">
                {loading ? 'Analyzing...' : 'Analyze with AI'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] rounded-2xl border border-gray-800 w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">Report Safety Issue</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Type</label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white"
                >
                  <option value="SCAM">Scam</option>
                  <option value="UNSAFE_AREA">Unsafe Area</option>
                  <option value="FAKE_GUIDE">Fake Guide</option>
                  <option value="TAXI_FRAUD">Taxi Fraud</option>
                  <option value="OVERPRICING">Overpricing</option>
                  <option value="TOURIST_TRAP">Tourist Trap</option>
                  <option value="AGGRESSIVE_VENDOR">Aggressive Vendor</option>
                </select>
              </div>
              <Input
                placeholder="Title"
                value={newReport.title}
                onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                className="bg-[#1a1a1a] border-gray-800 text-white"
              />
              <Input
                placeholder="Location"
                value={newReport.location}
                onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                className="bg-[#1a1a1a] border-gray-800 text-white"
              />
              <Textarea
                placeholder="Description"
                value={newReport.description}
                onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                className="min-h-[120px] bg-[#1a1a1a] border-gray-800 text-white"
              />
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Severity</label>
                <select
                  value={newReport.severity}
                  onChange={(e) => setNewReport({ ...newReport, severity: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <Button onClick={() => setShowReportModal(false)} variant="outline" className="border-gray-800 text-gray-300">
                Cancel
              </Button>
              <Button onClick={handleSubmitReport} disabled={!newReport.title || !newReport.description} className="bg-[#fcaa13] hover:bg-[#fb6b10] text-white">
                Submit Report
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SafetyHub;
