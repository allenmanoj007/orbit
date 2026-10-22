import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

export default function InterestsPage() {
  const [interests, setInterests] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [category, setCategory] = useState('General');

  const fetchInterests = async () => {
    try {
      const res = await adminApi.get('/admin/interests');
      setInterests(res.data.data);
    } catch (e) {
      console.warn('Failed to load interests:', e);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await adminApi.post('/admin/interests', { name, emoji, category });
      setName('');
      fetchInterests();
    } catch (e) {
      alert('Could not create interest category');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Interests & Hobbies Taxonomy</h1>
        <p className="text-sm text-slate-500 mt-1">
          Curate the standard interest catalog that powers Orbit’s compatibility algorithm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Creation Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">Add New Interest</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="e.g. Scuba Diving"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Emoji
              </label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-sm transition"
            >
              Add Interest
            </button>
          </form>
        </div>

        {/* Existing Interests Badges */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Active Catalog ({interests.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-700"
              >
                <span>{item.emoji}</span>
                <span>{item.name}</span>
                <span className="text-xs text-slate-400 ml-1">({item.category})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
