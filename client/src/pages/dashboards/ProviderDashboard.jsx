import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, BarChart2, Settings, LogOut,
  ToggleLeft, CheckCircle, XCircle, TrendingUp, Star, Clock, RefreshCw,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { mockBookings, mockServices, mockProviders, providerEarningsData } from '../../data/mockData';
import { formatCurrency, formatDate, getInitials } from '../../utils';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'earnings', label: 'Earnings', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function ProviderDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAvailable, setIsAvailable] = useState(true);

  // Get provider info from providers list (demo: use first provider)
  const provider = mockProviders[0];
  const myBookings = mockBookings.filter(b => b.providerId === (provider?.id || 'p1'));

  const totalEarnings = myBookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.amount, 0);
  const pendingCount = myBookings.filter(b => b.status === 'Pending').length;
  const completedCount = myBookings.filter(b => b.status === 'Completed').length;

  const handleLogout = () => { logout(); navigate('/'); toast.success('Logged out!'); };
  const toggleAvailability = () => {
    setIsAvailable(p => !p);
    toast.success(isAvailable ? 'You are now offline' : 'You are now available for bookings!');
  };

  const statCards = [
    { label: 'Total Bookings', value: myBookings.length, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Completed Jobs', value: completedCount, icon: CheckCircle, color: 'text-success', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Total Earnings', value: formatCurrency(totalEarnings), icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  return (
    <div className="dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-64px)]">

        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 bg-slate-900 text-slate-200 flex flex-col">
          {/* Provider info */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              {provider?.avatar
                ? <img src={provider.avatar} alt="" className="w-12 h-12 rounded-2xl ring-2 ring-primary/40 object-cover" />
                : <div className="w-12 h-12 rounded-2xl bg-primary text-white font-bold flex items-center justify-center">{getInitials(user?.name || 'P')}</div>
              }
              <div className="min-w-0">
                <h3 className="font-bold text-white truncate">{user?.name || provider?.name}</h3>
                <p className="text-xs text-slate-400 capitalize">{user?.role || 'Provider'}</p>
              </div>
            </div>

            {/* Availability Toggle */}
            <button
              onClick={toggleAvailability}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${isAvailable ? 'bg-success/20 text-success border border-success/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-success animate-pulse' : 'bg-slate-500'}`} />
                {isAvailable ? 'Available' : 'Offline'}
              </span>
              <ToggleLeft className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 md:p-8">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">
                  Provider Dashboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  {isAvailable ? '🟢 You are currently accepting bookings.' : '🔴 You are currently offline.'}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card">
                      <div className={`inline-flex p-2 rounded-xl mb-3 ${s.bg}`}>
                        <Icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <div className="text-2xl font-heading font-bold text-slate-800 dark:text-white mb-1">{s.value}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Provider Rating */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-6">
                  <h2 className="font-bold text-slate-800 dark:text-white mb-4">Weekly Earnings</h2>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={providerEarningsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={v => `₹${v}`} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                          formatter={v => [formatCurrency(v), 'Earnings']}
                        />
                        <Bar dataKey="earnings" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-6">
                  <h2 className="font-bold text-slate-800 dark:text-white mb-5">Performance</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Rating</span>
                        <span className="font-bold text-amber-500 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400" />{provider?.rating}/5
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(provider?.rating / 5) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Completion Rate</span>
                        <span className="font-bold text-success">95%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <div className="h-full bg-success rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500 dark:text-slate-400">On-Time Rate</span>
                        <span className="font-bold text-primary">88%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="font-bold text-slate-800 dark:text-white">Upcoming Jobs</h2>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-700">
                  {myBookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').map(b => {
                    const svc = mockServices.find(s => s.id === b.serviceId);
                    return (
                      <div key={b.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
                          {svc?.category === 'Electrician' ? '⚡' : svc?.category === 'Plumber' ? '🔧' : '🏠'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{svc?.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(b.date)} at {b.time}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-bold text-slate-800 dark:text-white text-sm">{formatCurrency(b.amount)}</span>
                          <Badge status={b.status} />
                        </div>
                      </div>
                    );
                  })}
                  {myBookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length === 0 && (
                    <div className="py-10 text-center text-slate-500">No upcoming bookings</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {activeTab === 'bookings' && (
            <div className="animate-fade-in space-y-6">
              <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">All Bookings</h1>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        {['Booking ID', 'Service', 'Date & Time', 'Amount', 'Status', 'Actions'].map(h => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                      {myBookings.map(b => {
                        const svc = mockServices.find(s => s.id === b.serviceId);
                        return (
                          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-primary">{b.id}</td>
                            <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{svc?.title}</td>
                            <td className="px-6 py-4 text-slate-500">{formatDate(b.date)} {b.time}</td>
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{formatCurrency(b.amount)}</td>
                            <td className="px-6 py-4"><Badge status={b.status} /></td>
                            <td className="px-6 py-4">
                              {b.status === 'Pending' && (
                                <div className="flex gap-2">
                                  <button className="p-1 rounded-lg bg-green-50 text-success hover:bg-success hover:text-white transition-colors" title="Accept">
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 rounded-lg bg-red-50 text-danger hover:bg-danger hover:text-white transition-colors" title="Decline">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── EARNINGS ── */}
          {activeTab === 'earnings' && (
            <div className="animate-fade-in space-y-6">
              <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">Earnings</h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Earned', value: formatCurrency(provider?.earnings || 89000), color: 'text-primary' },
                  { label: 'This Month', value: formatCurrency(12400), color: 'text-success' },
                  { label: 'Pending Payout', value: formatCurrency(3200), color: 'text-amber-500' },
                ].map(e => (
                  <div key={e.label} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card text-center">
                    <p className="text-sm text-slate-500 mb-2">{e.label}</p>
                    <p className={`text-2xl font-heading font-bold ${e.color}`}>{e.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-6">
                <h2 className="font-bold text-slate-800 dark:text-white mb-6">Weekly Breakdown</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={providerEarningsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} tickFormatter={v => `₹${v}`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} formatter={v => [formatCurrency(v), 'Earnings']} />
                      <Bar dataKey="earnings" fill="#10B981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in max-w-lg space-y-6">
              <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">Account Settings</h1>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card divide-y divide-slate-100 dark:divide-slate-700">
                {[
                  { label: 'Business Name', value: provider?.business },
                  { label: 'Category', value: provider?.category },
                  { label: 'Experience', value: `${provider?.experience} years` },
                  { label: 'Service Area', value: provider?.area },
                  { label: 'Availability', value: isAvailable ? 'Available' : 'Offline' },
                ].map(f => (
                  <div key={f.label} className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{f.label}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
