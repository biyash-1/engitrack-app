'use client';

import { useUsers, useUpdateUserRole, useUpdateUserSubscription, useUpdateUserStatus } from '@/hooks/useAdmin';
import { useAuth } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';
import { UserCheck, UserX } from 'lucide-react';

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const updateSubscription = useUpdateUserSubscription();
  const updateStatus = useUpdateUserStatus();

  const handleRoleChange = (userId: number, role: string) => {
    updateRole.mutate(
      { id: userId, role },
      {
        onSuccess: () => toast.success('Role updated'),
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || 'Failed to update role');
        },
      }
    );
  };

  const handleSubscriptionChange = (userId: number, subscription: string) => {
    updateSubscription.mutate(
      { id: userId, subscription },
      {
        onSuccess: () => toast.success('Subscription updated'),
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || 'Failed to update subscription');
        },
      }
    );
  };

  const handleStatusToggle = (userId: number, currentStatus: number) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      updateStatus.mutate(
        { id: userId, is_active: !currentStatus },
        {
          onSuccess: () => toast.success(`User ${action}d`),
          onError: (err: unknown) => {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to update status');
          },
        }
      );
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            {users?.length || 0} registered users
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Subscription</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users?.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={u.id === currentUser?.id}
                          className="px-2 py-1 border border-gray-200 rounded text-xs bg-white disabled:opacity-50"
                        >
                          <option value="admin">Admin</option>
                          <option value="engineer">Engineer</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={u.subscription}
                          onChange={(e) => handleSubscriptionChange(u.id, e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                        >
                          <option value="free_trial">Free Trial</option>
                          <option value="professional">Professional</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          u.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => handleStatusToggle(u.id, u.is_active)}
                            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
                              u.is_active
                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                : 'text-green-600 bg-green-50 hover:bg-green-100'
                            }`}
                          >
                            {u.is_active ? (
                              <>
                                <UserX size={12} />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck size={12} />
                                Activate
                              </>
                            )}
                          </button>
                        )}
                        {u.id === currentUser?.id && (
                          <span className="text-xs text-gray-400">You</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
