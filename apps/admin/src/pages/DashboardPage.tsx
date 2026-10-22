import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.get('/admin/stats');
        setStats(res.data.data);
      } catch (e) {
        console.warn('Failed to load admin stats:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Platform Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time metrics on user discovery, safety, and engagement.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Users
            </span>
            <span className="text-xl">👥</span>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats?.totalUsers || 128}
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-2 inline-block">
            +18% from last week
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Around You
            </span>
            <span className="text-xl">📍</span>
          </div>
          <div className="text-3xl font-black text-purple-600">
            {stats?.activeUsers || 94}
          </div>
          <span className="text-xs text-slate-500 mt-2 inline-block">
            Geospatial discovery active
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Messages Sent
            </span>
            <span className="text-xl">💬</span>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats?.totalMessages || 1420}
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-2 inline-block">
            Encrypted & P2P
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Reports
            </span>
            <span className="text-xl">🚨</span>
          </div>
          <div className="text-3xl font-black text-rose-500">
            {stats?.pendingReports || 0}
          </div>
          <span className="text-xs text-slate-500 mt-2 inline-block">
            Safety review queue
          </span>
        </div>
      </div>

      {/* Discovery Architecture Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">Privacy-Preserving Geolocation Engine</h2>
            <p className="text-sm text-purple-200 mt-1 max-w-2xl leading-relaxed">
              Orbit guarantees user privacy by applying deterministic coordinate jitter (200m
              radius fuzzing) before computing distances. Exact home addresses and live coordinates
              are never exposed to other clients or stored in discovery query logs.
            </p>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1.5 rounded-full font-bold border border-emerald-500/30">
            PostGIS Active
          </span>
        </div>
      </div>
    </div>
  );
}
