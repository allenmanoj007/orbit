import React from 'react';

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Media Moderation & Nearby Snaps</h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor temporary broadcast feeds, filter safety flags, and view auto-expiring media logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-2">Automated Expiry Sweeper</h2>
          <p className="text-xs text-slate-500 mb-4">
            Orbit database worker cleans expired snaps and 24-hour stories automatically.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs py-2 border-b border-slate-100">
              <span className="text-slate-500">Nearby Snaps Expiry:</span>
              <span className="font-bold text-slate-700">24 Hours</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-slate-100">
              <span className="text-slate-500">Disappearing Direct Snaps:</span>
              <span className="font-bold text-slate-700">View Once / 24h / 7d</span>
            </div>
            <div className="flex justify-between text-xs py-2">
              <span className="text-slate-500">Sweeper Job Status:</span>
              <span className="font-bold text-emerald-600">Active (cron)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-2">AI Media Moderation Pipeline</h2>
          <p className="text-xs text-slate-500 mb-4">
            All user-uploaded photos and video frames pass through automated content-safety filters
            before broadcasting to Nearby Snaps feeds.
          </p>
          <div className="bg-purple-50 text-purple-700 p-3 rounded-xl text-xs font-medium">
            🛡️ SafeSearch & Sharp image processing active on all multipart uploads.
          </div>
        </div>
      </div>
    </div>
  );
}
