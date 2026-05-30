"use client";

import { useState } from "react";
import { useProjects, useDeleteProject } from "@/hooks/useProjects";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, FolderKanban, Search } from "lucide-react";

export default function ProjectsPage() {
  const { user, isAdmin, isViewer } = useAuth();
  const { data: projects, isLoading, error } = useProjects();
  const deleteProject = useDeleteProject();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProject.mutate(id, {
        onSuccess: () => toast.success("Project deleted"),
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || "Failed to delete");
        },
      });
    }
  };

  const filteredProjects = projects?.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Failed to load projects</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            {projects?.length || 0} project{projects?.length !== 1 ? "s" : ""}{" "}
            total
          </p>
        </div>

        {!isViewer && (
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Project
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="other">Other</option>
        </select>
      </div>

      {filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderKanban size={18} className="text-blue-500" />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {project.name}
                  </h3>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600 capitalize">
                  {project.type}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {project.description || "No description"}
              </p>

              <div className="text-xs text-gray-400 mb-4">
                <p>By {project.creator_name}</p>
                <p>{new Date(project.created_at).toLocaleDateString()}</p>
              </div>

              {(isAdmin || (!isViewer && project.creator_id === user?.id)) && (
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Pencil size={12} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id, project.name)}
                    disabled={deleteProject.isPending}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <FolderKanban size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No projects found
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {search || typeFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first project to get started"}
          </p>
          {!isViewer && !search && typeFilter === "all" && (
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus size={16} />
              Create Project
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
