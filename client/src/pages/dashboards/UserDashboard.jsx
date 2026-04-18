import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home, Calendar, User, Heart, CreditCard, LogOut,
  Bell, Plus, Star, ChevronRight, RefreshCw, MapPin, Clock,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { mockBookings, mockServices, mockProviders } from '../../data/mockData';
import { formatCurrency, formatDate, getInitials } from '../../utils';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

export default function UserDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('All');

  const userBookings = mockBookings.filter(b => b.customerId === (user?.id || 'u1'));
  const filteredBookings = statusFilter === 'All' ? userBookings : userBookings.filter(b => b.status === statusFilter);
  const favoriteServices = mockServices.filter(s => user?.favorites?.includes(s.id));

  const stats = [
    { label: 'Total Bookings', value: userBookings.length, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Pending', value: userBookings.filter(b => b.status === 'Pending').length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Completed', value: userBookings.filter(b => b.status === 'Completed').length, color: 'text-success', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Cancelled', value: userBookings.filter(b => b.status === 'Cancelled').length, color: 'text-danger', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  const handleLogout = () => { logout(); navigate('/'); toast.success('Logged out successfully!'); };

  const handleRebook = (booking) => {
    const service = mockServices.find(s => s.id === booking.serviceId);
    const provider = mockProviders.find(p => p.id === booking.providerId);
    navigate('/booking', { state: { service, provider } });
  };

  const handleRemoveFavorite = (serviceId) => {
    updateUser({ favorites: user.favorites.filter(id => id !== serviceId) });
    toast.success('Removed from favorites');
  };

  return (
    <div className="dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-64px)]">

        {/* ── SIDEBAR ── */}
        <aside className="w-full md:w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
          {/* User Info */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/20" />
                : <div className="w-12 h-12 rounded-2xl bg-primary text-white font-bold flex items-center justify-center">{getInitials(user?.name)}</div>
              }
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-white truncate">{user?.name}</h3>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-primary text-white shadow-glow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {item.id === 'favorites' && favoriteServices.length > 0 && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                      {favoriteServices.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-700">
            <Link to="/services">
              <button className="flex items-center gap-2 w-full px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors mb-2">
                <Plus className="w-4 h-4" /> Book a Service
              </button>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 md:p-8">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's what's happening with your account.</p>
                </div>
                <Link to="/services" className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" /> New Booking
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(s => (
                  <div key={s.label} className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card`}>
                    <div className={`inline-block px-2 py-1 rounded-lg text-xs font-bold mb-3 ${s.bg} ${s.color}`}>
                      {s.label}
                    </div>
                    <div className={`text-3xl font-heading font-bold ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="font-bold text-slate-800 dark:text-white">Recent Bookings</h2>
                  <button onClick={() => setActiveTab('bookings')} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        {['Service', 'Date', 'Amount', 'Status', 'Action'].map(h => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                      {userBookings.slice(0, 5).map(b => {
                        const svc = mockServices.find(s => s.id === b.serviceId);
                        return (
                          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{svc?.title || '—'}</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{formatDate(b.date)} at {b.time}</td>
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{formatCurrency(b.amount)}</td>
                            <td className="px-6 py-4"><Badge status={b.status} /></td>
                            <td className="px-6 py-4">
                              {b.status === 'Completed' && (
                                <button onClick={() => handleRebook(b)} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3" /> Rebook
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '⚡', label: 'Electrician', to: '/services?category=Electrician' },
                  { icon: '🔧', label: 'Plumber', to: '/services?category=Plumber' },
                  { icon: '🧹', label: 'Cleaning', to: '/services?category=Cleaning' },
                  { icon: '❄️', label: 'AC Repair', to: '/services?category=AC+Repair' },
                ].map(q => (
                  <Link key={q.label} to={q.to} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card flex flex-col items-center gap-2 hover:border-primary/30 hover:-translate-y-0.5 transition-all">
                    <span className="text-2xl">{q.icon}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{q.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {activeTab === 'bookings' && (
            <div className="animate-fade-in space-y-6">
              <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">My Bookings</h1>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary'}`}>
                    {s}
                  </button>
                ))}
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-3">📋</div>
                  <h3 className="font-bold text-slate-700 dark:text-white">No bookings found</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {statusFilter !== 'All' ? `No ${statusFilter} bookings.` : 'Start by booking a service!'}
                  </p>
                  <Link to="/services" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">
                    Browse Services
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map(b => {
                    const svc = mockServices.find(s => s.id === b.serviceId);
                    const prov = mockProviders.find(p => p.id === b.providerId);
                    return (
                      <div key={b.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                          {svc?.category === 'Electrician' ? '⚡' : svc?.category === 'Plumber' ? '🔧' : svc?.category === 'Cleaning' ? '🧹' : '🏠'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-slate-800 dark:text-white truncate">{svc?.title}</p>
                            <Badge status={b.status} />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(b.date)} at {b.time}</span>
                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{prov?.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-bold text-slate-800 dark:text-white">{formatCurrency(b.amount)}</span>
                          {b.status === 'Completed' && (
                            <button onClick={() => handleRebook(b)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                              <RefreshCw className="w-3 h-3 shrink-0" /> Rebook
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── FAVORITES ── */}
          {activeTab === 'favorites' && (
            <div className="animate-fade-in space-y-6">
              <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">Saved Services</h1>
              {favoriteServices.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-3">❤️</div>
                  <h3 className="font-bold text-slate-700 dark:text-white">No Favorites Yet</h3>
                  <p className="text-slate-500 text-sm mt-1">Browse services and tap ❤️ to save them here.</p>
                  <Link to="/services" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Browse Services</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteServices.map(s => {
                    const prov = mockProviders.find(p => p.id === s.providerId);
                    return (
                      <div key={s.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-5 flex gap-4">
                        {s.image
                          ? <img src={s.image} alt={s.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                          : <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">🏠</div>
                        }
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 dark:text-white text-sm mb-1 truncate">{s.title}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs text-slate-600 dark:text-slate-300">{s.rating}</span>
                          </div>
                          <p className="text-sm font-bold text-primary">{formatCurrency(s.price)}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link to={`/services/${s.id}`} state={{ service: s, provider: prov }} className="text-xs text-primary font-semibold hover:underline">View</Link>
                          <button onClick={() => handleRemoveFavorite(s.id)} className="text-xs text-danger font-semibold hover:underline">Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in max-w-lg space-y-6">
              <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">My Profile</h1>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                  {user?.avatar
                    ? <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary/20" />
                    : <div className="w-20 h-20 rounded-2xl bg-primary text-white text-2xl font-bold flex items-center justify-center">{getInitials(user?.name)}</div>
                  }
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user?.name}</h2>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                    <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">{user?.role}</span>
                  </div>
                </div>
                {[
                  { label: 'Email', value: user?.email || '—' },
                  { label: 'Phone', value: user?.phone || 'Not added' },
                  { label: 'Address', value: user?.address || 'Not added' },
                  { label: 'Member Since', value: formatDate(user?.joinedAt || new Date().toISOString()) },
                ].map(field => (
                  <div key={field.label} className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{field.label}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white text-right max-w-[200px] truncate">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PAYMENTS ── */}
          {activeTab === 'payments' && (
            <div className="animate-fade-in space-y-6">
              <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">Payment History</h1>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        {['Booking ID', 'Service', 'Date', 'Amount', 'Status'].map(h => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                      {userBookings.map(b => {
                        const svc = mockServices.find(s => s.id === b.serviceId);
                        return (
                          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-primary">{b.id}</td>
                            <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{svc?.title}</td>
                            <td className="px-6 py-4 text-slate-500">{formatDate(b.date)}</td>
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{formatCurrency(b.amount)}</td>
                            <td className="px-6 py-4"><Badge status={b.status} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
