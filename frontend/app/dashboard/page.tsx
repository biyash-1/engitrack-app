'use client';
import { useAuth } from '@/lib/auth';
import { useProjects } from '@/hooks/useProjects';
import { useAdminStats } from '@/hooks/useAdmin';
import { formatDate } from '../../utils/date';
import {
  FolderKanban,
  Users,
  CreditCard,
  Activity,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: adminData, isLoading: statsLoading } = useAdminStats();

  const getSubscriptionStatus = () => {
    if (!user) return null;
    if (user.subscription === 'free_trial' && user.subscription_expires_at) {
      const expiry = new Date(user.subscription_expires_at);
      const now = new Date();
      const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 0) return { text: 'Trial Expired', color: 'text-red-600 bg-red-50' };
      return { text: `${daysLeft} days left`, color: 'text-yellow-600 bg-yellow-50' };
    }
    return { text: 'Active', color: 'text-green-600 bg-green-50' };
  };

  const subStatus = getSubscriptionStatus();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-500 mt-1">Here&apos;s an overview of your workspace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500"> Projects</span>
            <FolderKanban size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold">
            {projectsLoading ? '...' : projects?.length || 0}
          </p>
        </div>
       
        {!isAdmin && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Subscription</span>
              <CreditCard size={18} className="text-purple-500" />
            </div>
            <p className="text-lg font-bold capitalize">
              {user?.subscription?.replace('_', ' ')}
            </p>
            {subStatus && (
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${subStatus.color}`}>
                {subStatus.text}
              </span>
            )}
          </div>
        )}

        {isAdmin && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Total Users</span>
                <Users size={18} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold">
                {statsLoading ? '...' : adminData?.stats.totalUsers || 0}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">All Projects</span>
                <Activity size={18} className="text-orange-500" />
              </div>
              <p className="text-2xl font-bold">
                {statsLoading ? '...' : adminData?.stats.totalProjects || 0}
              </p>
            </div>
          </>
        )}

        {!isAdmin && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Role</span>
                <Users size={18} className="text-green-500" />
              </div>
              <p className="text-lg font-bold capitalize">{user?.role}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Account Status</span>
                <Activity size={18} className="text-orange-500" />
              </div>
              <p className="text-lg font-bold text-green-600">Active</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/dashboard/projects"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">View Projects</h3>
              <p className="text-sm text-gray-500 mt-1">Manage your engineering projects</p>
            </div>
            <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>

        <Link
          href="dashboard/subscription"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Subscription Plans</h3>
              <p className="text-sm text-gray-500 mt-1">View and manage your plan</p>
            </div>
            <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>
      </div>

      {projects && projects.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Projects</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{project.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{project.type} • {formatDate(project.created_at)}</p>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600 capitalize">
                  {project.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
