import { useState, useEffect } from "react";
import { useProjectsStore } from "../store/projects";
import { IconPlus, IconFolder } from "@tabler/icons-react";
import { IconButton } from "./button";
import { showToast } from "./ui-lib";
import styles from "./projects.module.scss";

export function ProjectsPage() {
  const [newProjectName, setNewProjectName] = useState("");
  const projectStore = useProjectsStore();

  useEffect(() => {
    // Call fetchProjects through the store instance
    projectStore.fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      showToast("Please enter a project name");
      return;
    }
    await projectStore.createProject(newProjectName);
    setNewProjectName("");
  };

  return (
    <div className={styles.projects}>
      <div className={styles.header}>
        <h2>Projects</h2>
        <div className={styles.createProject}>
          <input
            type="text"
            placeholder="New project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateProject();
              }
            }}
          />
          <IconButton
            icon={<IconPlus />}
            text="Create Project"
            onClick={handleCreateProject}
          />
        </div>
      </div>

      <div className={styles.projectList}>
        {projectStore.projects.map((project) => (
          <div
            key={project.id}
            className={styles.projectItem}
            onClick={() => projectStore.setCurrentProject(project.id)}
          >
            <IconFolder className={styles.projectIcon} />
            <div className={styles.projectInfo}>
              <div className={styles.projectName}>{project.name}</div>
              <div className={styles.projectDate}>
                Created on {new Date(project.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
