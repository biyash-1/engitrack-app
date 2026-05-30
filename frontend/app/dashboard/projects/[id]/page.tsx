'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProject, useUpdateProject } from '@/hooks/useProjects';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectInput } from '@/schemas/project';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
const projectId = params.id as string;

  const { data: project, isLoading } = useProject(projectId);
  const updateProject = useUpdateProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
  });


  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        type: project.type,
        description: project.description || '',
      });
    }
  }, [project, reset]);

  const onSubmit = async (data: ProjectInput) => {
    updateProject.mutate(
      { id: projectId, ...data },
      {
        onSuccess: () => {
          toast.success('Project updated!');
          router.push('/dashboard/projects');
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || 'Failed to update');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Project not found</p>
        <Link href="/dashboard/projects" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          Back to Projects
        </Link>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
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
              className={`w-full px-3 py-2.5 border ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm`}
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
              className={`w-full px-3 py-2.5 border ${
                errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent`}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="other">Other</option>
            </select>
            {errors.type && (
              <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>
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
              className={`w-full px-3 py-2.5 border ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm resize-none`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              <p>Created by {project.creator_name} on {new Date(project.created_at).toLocaleDateString()}</p>
              <p>Last updated: {new Date(project.updated_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || updateProject.isPending}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors cursor-pointer"
            >
              {updateProject.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save size={16} />
              )}
              {updateProject.isPending ? 'Saving...' : 'Save Changes'}
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
