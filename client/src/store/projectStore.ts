import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  url: string;
}

export interface ProjectStore {
  currentProject: Project | null;
  availableProjects: Project[];
  setProject: (project: Project) => void;
  addProject: (project: Project) => void;
  clearProjects: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,
  availableProjects: [],
  setProject: (project) => set({ currentProject: project }),
  addProject: (project) =>
    set((state) => ({
      availableProjects: [...state.availableProjects, project].filter(
        (p, i, a) => a.findIndex((t) => t.id === p.id) === i
      ), // Add project if not already present
    })),
  clearProjects: () => set({ currentProject: null, availableProjects: [] }),
})); 