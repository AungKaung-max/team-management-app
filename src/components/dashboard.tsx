"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { LogOut, Users, Trophy, Sparkles } from "lucide-react";
import { useApp } from "@/app/contexts/auth-context";
import { SummaryCards } from "./summer-cards";
import { PlayersSection } from "./players-section";
import { TeamsSection } from "./teams-section";
import { TeamModal } from "./team-model";

export function Dashboard() {
  const { username, logout } = useApp();
  const [activeTab, setActiveTab] = useState<"players" | "teams">("players");
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
                  NBA Team Manager
                </h1>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === "players" ? "default" : "outline"}
                  onClick={() => setActiveTab("players")}
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Players</span>
                </Button>
                <Button
                  variant={activeTab === "teams" ? "default" : "outline"}
                  onClick={() => setActiveTab("teams")}
                  className="flex items-center space-x-2"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Teams</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome,{" "}
                <span className="font-semibold text-blue-700">{username}</span>
              </span>
              <Button variant="outline" onClick={logout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SummaryCards />
        {activeTab === "players" && <PlayersSection />}
        {activeTab === "teams" && (
          <TeamsSection onCreateTeam={() => setIsTeamModalOpen(true)} />
        )}
      </main>

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </div>
  );
}
