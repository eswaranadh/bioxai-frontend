import { useEffect, useState } from "react";
import { IconPlus, IconFolder, IconTrash, IconEdit, IconLoader } from "@tabler/icons-react";
import { useProjectsStore } from "../../store/projects";
import { Path } from "../../constant";
import { useRouter } from "next/navigation";
import { showToast } from "../../store/toast";
import { showModal, useModalStore } from "../../store/modal";

export function ProjectsPage() {
  const router = useRouter();
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const { projects, loading, fetchProjects, createProject, setCurrentProject } = useProjectsStore();
  const { setShowModal } = useModalStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      showToast("Please enter a project name");
      return;
    }
    await createProject(newProjectName.trim(), newProjectDesc.trim() || undefined);
    setNewProjectName("");
    setNewProjectDesc("");
    setShowModal(false);
  };

  const handleProjectClick = (projectId: number) => {
    setCurrentProject(projectId);
    router.push(Path.Chat);
  };

  const showCreateProjectModal = () => {
    showModal({
      title: "Create New Project",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter project description"
              rows={3}
            />
          </div>
        </div>
      ),
      actions: [
        {
          text: "Cancel",
          onClick: () => setShowModal(false),
        },
        {
          text: "Create",
          onClick: handleCreateProject,
          primary: true,
        },
      ],
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button
          onClick={showCreateProjectModal}
          className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <IconPlus size={20} />
          <span>New Project</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <IconLoader className="animate-spin" size={24} />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <IconFolder size={48} className="mx-auto mb-4" />
            <p>No projects yet</p>
            <p className="text-sm">Create a new project to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="border rounded-lg p-4 cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement edit project
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <IconEdit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement delete project
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full text-red-500"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
