import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Project, Chat, requestGetProjects, requestCreateProject, requestGetProjectChats, requestCreateChat } from "../client/projects";
import { showToast } from "../components/ui-lib";

interface ProjectsState {
  projects: Project[];
  currentProjectId: number | null;
  projectChats: { [key: number]: Chat[] };
  loading: boolean;
}

interface ProjectsActions {
  fetchProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<void>;
  setCurrentProject: (projectId: number | null) => void;
  fetchProjectChats: (projectId: number) => Promise<void>;
  createChat: (projectId: number, name?: string) => Promise<void>;
}

export type ProjectsStore = ProjectsState & ProjectsActions;

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      // State
      projects: [],
      currentProjectId: null,
      projectChats: {},
      loading: false,

      // Actions
      fetchProjects: async () => {
        try {
          set({ loading: true });
          const projects = await requestGetProjects();
          set({ projects, loading: false });
        } catch (error) {
          console.error("Failed to get projects:", error);
          showToast("Failed to get projects");
          set({ loading: false });
        }
      },

      createProject: async (name: string, description?: string) => {
        try {
          set({ loading: true });
          const project = await requestCreateProject(name, description);
          set((state) => ({
            projects: [...state.projects, project],
            loading: false,
          }));
          showToast("Project created successfully");
        } catch (error) {
          console.error("Failed to create project:", error);
          showToast("Failed to create project");
          set({ loading: false });
        }
      },

      setCurrentProject: (projectId: number | null) => {
        set({ currentProjectId: projectId });
        if (projectId !== null) {
          get().fetchProjectChats(projectId);
        }
      },

      fetchProjectChats: async (projectId: number) => {
        try {
          set({ loading: true });
          const chats = await requestGetProjectChats(projectId);
          set((state) => ({
            projectChats: {
              ...state.projectChats,
              [projectId]: chats,
            },
            loading: false,
          }));
        } catch (error) {
          console.error("Failed to get project chats:", error);
          showToast("Failed to get project chats");
          set({ loading: false });
        }
      },

      createChat: async (projectId: number, name?: string) => {
        try {
          set({ loading: true });
          const chat = await requestCreateChat(projectId, name);
          set((state) => ({
            projectChats: {
              ...state.projectChats,
              [projectId]: [...(state.projectChats[projectId] || []), chat],
            },
            loading: false,
          }));
          showToast("Chat created successfully");
        } catch (error) {
          console.error("Failed to create chat:", error);
          showToast("Failed to create chat");
          set({ loading: false });
        }
      },
    }),
    {
      name: "biochatter-projects",
      version: 1,
    },
  ),
);
