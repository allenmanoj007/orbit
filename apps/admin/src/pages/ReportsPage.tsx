import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await adminApi.get('/admin/reports');
        setReports(res.data.data.reports);
      } catch (e) {
        console.warn('Failed to load reports:', e);
      }
    };
    fetchReports();
  }, []);

  const handleResolve = async (reportId: string, status: string) => {
    try {
      await adminApi.patch(`/admin/reports/${reportId}`, {
        status,
        reviewNotes: 'Reviewed by administrator',
      });
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (e) {
      alert('Could not update report');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Safety & Abuse Reports</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review community reports regarding spam, harassment, or inappropriate media.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl">🛡️</span>
            <p className="text-sm font-bold text-slate-700 mt-3">Clean Horizon</p>
            <p className="text-xs text-slate-400 mt-1">No pending reports currently in queue.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 border border-slate-100 rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-red-100 text-red-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {report.reason}
                    </span>
                    <span className="text-xs text-slate-400">
                      Reported by @{report.reporter?.profile?.username}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mt-2">
                    Target: @{report.reportedUser?.profile?.username}
                  </p>
                  {report.description ? (
                    <p className="text-xs text-slate-500 mt-1">{report.description}</p>
                  ) : null}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleResolve(report.id, 'RESOLVED')}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs px-3 py-2 rounded-lg"
                  >
                    Take Action
                  </button>
                  <button
                    onClick={() => handleResolve(report.id, 'DISMISSED')}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-xs px-3 py-2 rounded-lg"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
