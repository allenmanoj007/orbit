import React from 'react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Platform Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure discovery radius limits, security thresholds, and infrastructure endpoints.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-2xl">
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-1">Default Nearby Discovery Radius</h2>
          <p className="text-xs text-slate-500 mb-3">
            Initial search diameter for new users opening the Nearby tab.
          </p>
          <input
            type="number"
            defaultValue={10}
            className="border border-slate-200 rounded-xl px-4 py-2 text-sm w-32 font-bold"
          />
          <span className="text-xs text-slate-500 ml-2">kilometers</span>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h2 className="text-sm font-bold text-slate-900 mb-1">WebRTC STUN / TURN Infrastructure</h2>
          <p className="text-xs text-slate-500 mb-2">
            Signaling server configuration for P2P audio and video calls.
          </p>
          <code className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg text-purple-700 font-mono block">
            stun:stun.l.google.com:19302
          </code>
        </div>
      </div>
    </div>
  );
}
