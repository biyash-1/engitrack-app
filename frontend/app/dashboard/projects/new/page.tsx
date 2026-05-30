'use client';

import { useRouter } from 'next/navigation';
import { useCreateProject } from '@/hooks/useProjects';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectInput } from '@/schemas/project';

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      type: 'residential',
      description: '',
    },
  });
  const isAdminOrEngineer = user?.role === 'admin' || user?.role === 'engineer';
  const isFreeTrial = !isAdminOrEngineer && user?.subscription === 'free_trial';
  const projectTypes = [
    { value: 'residential', label: 'Residential', available: true },
    { value: 'commercial', label: 'Commercial', available: !isFreeTrial },
    { value: 'infrastructure', label: 'Infrastructure', available: !isFreeTrial },
    { value: 'other', label: 'Other', available: !isFreeTrial },
  ];

  const onSubmit = async (data: ProjectInput) => {
    createProject.mutate(
      data,
      {
        onSuccess: () => {
          toast.success('Project created successfully!');
          router.push('/dashboard/projects');
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || 'Failed to create project');
        },
      }
    );
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full px-3 py-2.5 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm`}
              placeholder="e.g. Highway Bridge Design"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Project Type *
            </label>
            <select
              id="type"
              {...register('type')}
              className={`w-full px-3 py-2.5 border ${errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent`}
            >
              {projectTypes.map((t) => (
                <option key={t.value} value={t.value} disabled={!t.available}>
                  {t.label} {!t.available ? '(Upgrade required)' : ''}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>
            )}
            {isFreeTrial && (
              <p className="text-xs text-yellow-600 mt-1">
                Free trial only allows Residential projects. Upgrade to unlock all types.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className={`w-full px-3 py-2.5 border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm resize-none`}
              placeholder="Describe the project..."
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || createProject.isPending}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors cursor-pointer"
            >
              {createProject.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save size={16} />
              )}
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </button>
            <Link
              href="/dashboard/projects"
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
