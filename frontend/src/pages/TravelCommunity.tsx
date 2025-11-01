import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Star, Heart, MessageCircle, Search, Send, TrendingUp, Compass, Camera, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { auth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const API_BASE = 'http://localhost:5000/api';

const TravelCommunity = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [travelBuddies, setTravelBuddies] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', image: '', tags: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        setLoading(true);
        const token = auth.getToken();
        const response = await fetch(`${API_BASE}/travel-buddies`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setTravelBuddies(data);
        }
      } catch (error) {
        console.error('Error fetching buddies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (auth.isAuthenticated() && activeTab === 'buddies') {
      fetchBuddies();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = auth.getToken();
        const response = await fetch(`${API_BASE}/posts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (auth.isAuthenticated() && activeTab === 'feed') {
      fetchPosts();
    }
  }, [activeTab]);

  const handleCreatePost = async () => {
    try {
      const token = auth.getToken();
      const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newPost.content,
          image: newPost.image,
          tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      if (response.ok) {
        const post = await response.json();
        setPosts([post, ...posts]);
        setShowCreatePost(false);
        setNewPost({ content: '', image: '', tags: '' });
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (!auth.isAuthenticated()) {
    return null;
  }





  const groups = [
    {
      id: 1,
      name: 'Himalayan Trekkers',
      members: 1247,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      description: 'For mountain lovers and adventure seekers'
    },
    {
      id: 2,
      name: 'Digital Nomads Asia',
      members: 3421,
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop',
      description: 'Remote workers exploring Southeast Asia'
    },
    {
      id: 3,
      name: 'Solo Female Travelers',
      members: 2156,
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
      description: 'Empowering women to travel fearlessly'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-[#111111] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Travel Community</h1>
              <p className="text-gray-400 mt-1">Connect with travelers worldwide</p>
            </div>
            <Button onClick={() => setShowCreatePost(true)} className="bg-[#fcaa13] hover:bg-[#fb6b10] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search travelers, destinations, or groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-[#1a1a1a] border-gray-800 text-white placeholder:text-gray-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#111111] border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'feed', label: 'Feed', icon: TrendingUp },
              { id: 'buddies', label: 'Find Buddies', icon: Users },
              { id: 'groups', label: 'Groups', icon: Compass }
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#111111] rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all"
                >
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-3">
                      <img src={post.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&background=fcaa13&color=fff`} alt={post.user.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{post.user.name}</h3>
                        <p className="text-sm text-gray-400">{post.user.location || 'Traveler'} • {new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-200">{post.content}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-[#1a1a1a] text-gray-300 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Image */}
                  {post.image && <img src={post.image} alt="Post" className="w-full h-96 object-cover" />}

                  {/* Post Actions */}
                  <div className="p-6 pt-4 flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-[#fcaa13] transition-colors">
                      <Heart className="h-5 w-5" />
                      <span className="font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-[#fb6b10] transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-medium">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors ml-auto">
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Destinations */}
              <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6">
                <h3 className="font-bold text-white mb-4">Trending Destinations</h3>
                <div className="space-y-3">
                  {['Bali, Indonesia', 'Tokyo, Japan', 'Paris, France', 'Dubai, UAE'].map((dest, i) => (
                    <div key={dest} className="flex items-center justify-between">
                      <span className="text-gray-300">{dest}</span>
                      <span className="text-sm text-gray-500">#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Groups */}
              <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6">
                <h3 className="font-bold text-white mb-4">Suggested Groups</h3>
                <div className="space-y-4">
                  {groups.slice(0, 2).map((group) => (
                    <div key={group.id} className="flex gap-3">
                      <img src={group.image} alt={group.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{group.name}</h4>
                        <p className="text-xs text-gray-400">{group.members.toLocaleString()} members</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'buddies' && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#fcaa13] border-r-transparent"></div>
                <p className="text-gray-400 mt-4">Loading travel buddies...</p>
              </div>
            ) : travelBuddies.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No travel buddies found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {travelBuddies.map((buddy) => (
                  <motion.div
                    key={buddy.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#111111] rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img 
                          src={buddy.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(buddy.name)}&background=fcaa13&color=fff`} 
                          alt={buddy.name} 
                          className="w-16 h-16 rounded-full object-cover" 
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-white">{buddy.name}</h3>
                          <p className="text-sm text-gray-400">{buddy.location || 'Location not set'}</p>
                          {buddy.age && <p className="text-xs text-gray-500">{buddy.age} years old</p>}
                        </div>
                      </div>

                      {buddy.bio && (
                        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{buddy.bio}</p>
                      )}

                      {buddy.travelPreferences && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {buddy.travelPreferences.split(',').slice(0, 3).map((pref) => (
                            <span key={pref} className="px-3 py-1 bg-[#1a1a1a] text-gray-300 rounded-full text-xs">
                              {pref.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      <Button className="w-full bg-[#fcaa13] hover:bg-[#fb6b10] text-white">
                        Connect
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111111] rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all"
              >
                <img src={group.image} alt={group.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="font-bold text-white text-lg mb-2">{group.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{group.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{group.members.toLocaleString()} members</span>
                    <Button size="sm" className="bg-[#fcaa13] hover:bg-[#fb6b10] text-white">
                      Join
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] rounded-2xl border border-gray-800 w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Create Post</h2>
              <button onClick={() => setShowCreatePost(false)} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Textarea
                placeholder="Share your travel story..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="min-h-[150px] bg-[#1a1a1a] border-gray-800 text-white placeholder:text-gray-500"
              />
              <Input
                placeholder="Image URL (optional)"
                value={newPost.image}
                onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                className="bg-[#1a1a1a] border-gray-800 text-white placeholder:text-gray-500"
              />
              <Input
                placeholder="Tags (comma separated)"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                className="bg-[#1a1a1a] border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <Button onClick={() => setShowCreatePost(false)} variant="outline" className="border-gray-800 text-gray-300 hover:bg-[#1a1a1a]">
                Cancel
              </Button>
              <Button onClick={handleCreatePost} disabled={!newPost.content} className="bg-[#fcaa13] hover:bg-[#fb6b10] text-white">
                Post
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TravelCommunity;
