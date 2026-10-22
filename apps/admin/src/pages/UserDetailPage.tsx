import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';

export default function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // In production would fetch single user
    setUser({
      id: userId,
      email: 'alex@example.com',
      displayName: 'Alex Morgan',
      username: 'alex_m',
      profession: 'UI Designer',
      bio: 'Loves coffee and UI design',
      isBanned: false,
      interests: ['Design', 'Coffee', 'Gaming'],
    });
  }, [userId]);

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/users')}
        className="text-sm font-bold text-purple-600 hover:text-purple-700"
      >
        ← Back to Users
      </button>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 text-xl font-bold flex items-center justify-center">
            {user?.displayName ? user.displayName[0] : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{user?.displayName}</h1>
            <p className="text-xs text-slate-400">@{user?.username} · {user?.email}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm border-t border-slate-100 pt-4">
          <div>
            <span className="font-bold text-slate-400 text-xs uppercase block">Profession</span>
            <p className="text-slate-800 font-medium">{user?.profession}</p>
          </div>
          <div>
            <span className="font-bold text-slate-400 text-xs uppercase block">Bio</span>
            <p className="text-slate-800">{user?.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
