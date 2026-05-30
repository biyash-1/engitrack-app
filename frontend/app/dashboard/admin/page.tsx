"use client";

import { useAdminStats, useLoginLogs } from "@/hooks/useAdmin";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Users, FolderKanban, Activity, Shield } from "lucide-react";
import { formatDateTime } from "../../../utils/date";

export default function AdminPage() {
  const { data: adminData, isLoading: statsLoading } = useAdminStats();
  const { data: logs, isLoading: logsLoading } = useLoginLogs();

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            System overview and recent activity
          </p>
        </div>
        {statsLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">Total Users</span>
                  <Users size={18} className="text-blue-500" />
                </div>
                <p className="text-2xl font-bold">
                  {adminData?.stats.totalUsers || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {adminData?.stats.activeUsers || 0} active
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">Total Projects</span>
                  <FolderKanban size={18} className="text-green-500" />
                </div>
                <p className="text-2xl font-bold">
                  {adminData?.stats.totalProjects || 0}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    Roles Distribution
                  </span>
                  <Shield size={18} className="text-purple-500" />
                </div>
                <div className="space-y-1">
                  {adminData?.stats.usersByRole.map((r) => (
                    <div key={r.role} className="flex justify-between text-sm">
                      <span className="capitalize text-gray-600">{r.role}</span>
                      <span className="font-medium">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 mb-8">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Subscription Distribution
                </h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {adminData?.stats.usersBySubscription.map((s) => (
                    <div
                      key={s.subscription}
                      className="text-center p-4 bg-gray-50 rounded-lg"
                    >
                      <p className="text-2xl font-bold text-gray-900">
                        {s.count}
                      </p>
                      <p className="text-sm text-gray-500 capitalize mt-1">
                        {s.subscription.replace("_", " ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Recent Login Activity
            </h2>
            <Activity size={16} className="text-gray-400" />
          </div>

          {logsLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          ) : logs && logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                      IP Address
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                      Device
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.slice(0, 20).map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">
                          {log.user_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {log.user_email}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            log.action === "login"
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {log.ip_address || "N/A"}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {formatDateTime(log.logged_in_at)}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {log.user_agent?.includes("Firefox")
                          ? "Firefox"
                          : log.user_agent?.includes("Chrome")
                            ? "Chrome"
                            : "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">
              No login logs yet
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
