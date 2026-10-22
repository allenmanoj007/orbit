import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/users', { params: { search } });
      setUsers(res.data.data.users);
    } catch (e) {
      console.warn('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleBanToggle = async (userId: string, isBanned: boolean) => {
    try {
      if (isBanned) {
        await adminApi.post(`/admin/users/${userId}/unban`);
      } else {
        await adminApi.post(`/admin/users/${userId}/ban`, {
          reason: 'Terms of service violation',
        });
      }
      fetchUsers();
    } catch (e) {
      alert('Could not update user ban status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse accounts, verify safety reports, and manage platform permissions.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, profession..."
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-72 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-400">
            <tr>
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Profession</th>
              <th className="py-4 px-6">Location</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition">
                <td className="py-4 px-6 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    {u.profile?.displayName ? u.profile.displayName[0] : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{u.profile?.displayName || 'User'}</p>
                    <p className="text-xs text-slate-400">@{u.profile?.username || 'user'}</p>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">
                  {u.profile?.profession || '—'}
                </td>
                <td className="py-4 px-6 text-slate-500 text-xs">
                  {/* Notice: Only broad city/country shown, NEVER raw coordinates */}
                  San Francisco, US (Approximate)
                </td>
                <td className="py-4 px-6">
                  {u.isBanned ? (
                    <span className="bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-full font-bold">
                      Banned
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-600 text-xs px-2.5 py-1 rounded-full font-bold">
                      Active
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => handleBanToggle(u.id, u.isBanned)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                      u.isBanned
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-red-50 hover:bg-red-100 text-red-600'
                    }`}
                  >
                    {u.isBanned ? 'Unban' : 'Suspend / Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
