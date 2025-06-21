"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string;
  college: string;
  country: string;
  team: {
    id: number;
    full_name: string;
    city: string;
    conference: string;
  };
}

export interface Team {
  id: string;
  name: string;
  playerCount: number;
  region: string;
  country: string;
  players: Player[];
  createdAt: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;

  players: Player[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchPlayers: () => void;

  teams: Team[];
  addTeam: (team: Omit<Team, "id" | "createdAt">) => void;
  updateTeam: (id: string, team: Omit<Team, "id" | "createdAt">) => void;
  deleteTeam: (id: string) => void;
  isPlayerInTeam: (playerId: number) => boolean;
  getTeamByPlayer: (playerId: number) => Team | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const [page, setPage] = useState(0);

  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(authData.isAuthenticated);
        setUsername(authData.username);
      } catch (error) {
        console.error("Failed to load auth:", error);
      }
    }

    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      try {
        setTeams(JSON.parse(savedTeams));
      } catch (error) {
        console.error("Failed to load teams:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify({ isAuthenticated, username }));
  }, [isAuthenticated, username]);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const login = (user: string) => {
    setIsAuthenticated(true);
    setUsername(user);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setTeams([]);
  };

  const fetchPlayers = useCallback(async () => {
    if (loading || isRateLimited || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.balldontlie.io/v1/players?per_page=10&cursor=${page}`,
        {
          headers: {
            Authorization: "09625819-ad90-44a8-8247-efd4bf289bd3",
          },
        }
      );

      if (response.status === 429) {
        setIsRateLimited(true);
        setError("Too many requests. Please wait...");
        setLoading(false);
        setTimeout(() => {
          setIsRateLimited(false);
          setError(null);
        }, 10000);
        return;
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      setPlayers((prev) => [...prev, ...data.data]);

      if (data.data.length < 10) {
        setHasMore(false);
      }
      setPage((prev) => prev + 10);
    } catch (error) {
      console.error("Failed to fetch players:", error);
      setError("Failed to fetch players");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, isRateLimited]);

  const addTeam = (teamData: Omit<Team, "id" | "createdAt">) => {
    const newTeam: Team = {
      ...teamData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTeams((prev) => [...prev, newTeam]);
  };

  const updateTeam = (id: string, teamData: Omit<Team, "id" | "createdAt">) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === id ? { ...teamData, id, createdAt: team.createdAt } : team
      )
    );
  };

  const deleteTeam = (id: string) => {
    setTeams((prev) => prev.filter((team) => team.id !== id));
  };

  const isPlayerInTeam = (playerId: number) => {
    return teams.some((team) =>
      team.players.some((player) => player.id === playerId)
    );
  };

  const getTeamByPlayer = (playerId: number) => {
    return teams.find((team) =>
      team.players.some((player) => player.id === playerId)
    );
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        logout,
        players,
        loading,
        error,
        hasMore,
        fetchPlayers,
        teams,
        addTeam,
        updateTeam,
        deleteTeam,
        isPlayerInTeam,
        getTeamByPlayer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
