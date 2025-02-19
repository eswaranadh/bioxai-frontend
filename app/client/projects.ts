import { LOCAL_BASE_URL } from "../constant";
import { get_auth_header } from "./datarequest";

export interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
}

export interface Chat {
  id: number;
  project_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const requestGetProjects = async (): Promise<Project[]> => {
  const res = await fetch(`${LOCAL_BASE_URL}/v1/projects`, {
    headers: {
      ...get_auth_header()
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to get projects: ${res.statusText}`);
  }
  const data = await res.json();
  return data.projects;
};

export const requestCreateProject = async (name: string, description?: string): Promise<Project> => {
  console.log("requestCreateProject", name, description);
  console.log("requestCreateProject", get_auth_header());
  const res = await fetch(`${LOCAL_BASE_URL}/v1/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...get_auth_header()
    },
    body: JSON.stringify({ name, description })
  });
  if (!res.ok) {
    throw new Error(`Failed to create project: ${res.statusText}`);
  }
  const data = await res.json();
  return data.project;
};

export const requestGetProject = async (projectId: number): Promise<Project> => {
  const res = await fetch(`${LOCAL_BASE_URL}/v1/projects/${projectId}`, {
    headers: {
      ...get_auth_header()
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to get project: ${res.statusText}`);
  }
  const data = await res.json();
  return data.project;
};

export const requestUpdateProject = async (projectId: number, project: ProjectUpdate): Promise<Project> => {
  const res = await fetch(`${LOCAL_BASE_URL}/v1/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...get_auth_header()
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) {
    throw new Error(`Failed to update project: ${res.statusText}`);
  }
  const data = await res.json();
  return data.project;
};

export const requestDeleteProject = async (projectId: number): Promise<void> => {
  const res = await fetch(`${LOCAL_BASE_URL}/v1/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      ...get_auth_header()
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to delete project: ${res.statusText}`);
  }
};

export const requestGetProjectChats = async (projectId: number): Promise<Chat[]> => {
  const res = await fetch(`${LOCAL_BASE_URL}/v1/projects/${projectId}/chats`, {
    headers: {
      ...get_auth_header()
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to get project chats: ${res.statusText}`);
  }
  const data = await res.json();
  return data.chats;
};

export const requestCreateChat = async (projectId: number, name: string = "New Chat"): Promise<Chat> => {
  const res = await fetch(`${LOCAL_BASE_URL}/v1/projects/${projectId}/chats/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...get_auth_header()
    },
    body: JSON.stringify({ name })
  });
  if (!res.ok) {
    throw new Error(`Failed to create chat: ${res.statusText}`);
  }
  const data = await res.json();
  return data.chat;
};
