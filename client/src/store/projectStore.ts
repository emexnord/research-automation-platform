import { create } from 'zustand';

type Team = {
    id: string;
    name: string;
};

export interface TeamStore {
    currentTeam: Team | null;
    availableTeams: Team[];
    setTeam: (team: Team) => void;
    addTeam: (team: Team) => void;
    clearTeams: () => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
    currentTeam: null,
    availableTeams: [],
    setTeam: (team) => set({ currentTeam: team }),
    addTeam: (team) =>
        set((state) => ({
            availableTeams: [...state.availableTeams, team].filter((p, i, a) => a.findIndex((t) => t.id === p.id) === i) // Add team if not already present
        })),
    clearTeams: () => set({ currentTeam: null, availableTeams: [] })
}));
