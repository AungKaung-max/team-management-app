"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Calendar,
  Crown,
} from "lucide-react";
import { Team, useApp } from "@/app/contexts/auth-context";

interface TeamsSectionProps {
  onCreateTeam: () => void;
}

export function TeamsSection({ onCreateTeam }: TeamsSectionProps) {
  const { teams, deleteTeam } = useApp();
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      deleteTeam(teamId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-green-700">Your Teams</h2>
          <p className="text-gray-600">Create and manage your NBA teams</p>
        </div>
        <Button
          onClick={onCreateTeam}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Users className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No teams yet
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Start building your championship roster by creating your first
              team
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Crown className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{team.name}</CardTitle>
                      <div className="flex items-center space-x-1 mt-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {new Date(team.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTeam(team)}
                      className="text-blue-600 border-blue-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTeam(team.id)}
                      className="text-red-600 border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">
                        Location
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="font-medium">{team.region}</div>
                      <div className="text-xs text-gray-600">
                        {team.country}
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">
                        Roster
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="font-medium">
                        {team.players.length} / {team.playerCount}
                      </div>
                      <div className="text-xs text-gray-600">Players</div>
                    </div>
                  </div>
                </div>

                {team.players.length > 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Team Roster
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {team.players.slice(0, 4).map((player) => (
                        <Badge
                          key={player.id}
                          className="bg-blue-500 text-white"
                        >
                          {player.first_name} {player.last_name}
                        </Badge>
                      ))}
                      {team.players.length > 4 && (
                        <Badge className="bg-gray-200 text-gray-700">
                          +{team.players.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      No players assigned yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* {editingTeam && (
        <TeamModal
          isOpen={true}
          onClose={() => setEditingTeam(null)}
          team={editingTeam}
        />
      )} */}
    </div>
  );
}
