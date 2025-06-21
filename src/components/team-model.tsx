"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, Users, Crown } from "lucide-react";
import { type Player, type Team, useApp } from "@/app/contexts/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team?: Team;
}

type FormData = {
  name: string;
  playerCount: number;
  region: string;
  country: string;
  players: Player[];
};

export function TeamModal({ isOpen, onClose, team }: TeamModalProps) {
  const { teams, players, addTeam, updateTeam, isPlayerInTeam } = useApp();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    playerCount: 5,
    region: "",
    country: "",
    players: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        playerCount: team.playerCount,
        region: team.region,
        country: team.country,
        players: team.players,
      });
    } else {
      setFormData({
        name: "",
        playerCount: 5,
        region: "",
        country: "",
        players: [],
      });
    }
    setErrors({});
  }, [team, isOpen]);

  const availablePlayers = players.filter((player) => {
    if (team) {
      return (
        !isPlayerInTeam(player.id) ||
        team.players.some((p) => p.id === player.id)
      );
    }
    return !isPlayerInTeam(player.id);
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Team name is required";
    } else if (
      teams.some(
        (t) =>
          t.name.toLowerCase() === formData.name.trim().toLowerCase() &&
          t.id !== team?.id
      )
    ) {
      newErrors.name = "Team name must be unique";
    }

    if (formData.playerCount < 1 || formData.playerCount > 50) {
      newErrors.playerCount = "Player count must be between 1 and 50";
    }

    if (!formData.region.trim()) newErrors.region = "Region is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const teamData = {
      name: formData.name.trim(),
      playerCount: formData.playerCount,
      region: formData.region.trim(),
      country: formData.country.trim(),
      players: formData.players,
    };

    if (team) {
      updateTeam(team.id, teamData);
    } else {
      addTeam(teamData);
    }

    onClose();
  };

  const handleAddPlayer = (player: Player) => {
    if (formData.players.length >= formData.playerCount) return;
    setFormData((prev) => ({
      ...prev,
      players: [...prev.players, player],
    }));
  };

  const handleRemovePlayer = (playerId: number) => {
    setFormData((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== playerId),
    }));
  };

  const renderPlayerCard = (player: Player) => {
    const isSelected = formData.players.some((p) => p.id === player.id);
    const canAdd =
      !isSelected && formData.players.length < formData.playerCount;

    return (
      <Card
        key={player.id}
        className={isSelected ? "bg-blue-50 border-blue-200" : ""}
      >
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-2">
            <Badge>{player.position}</Badge>
            {isSelected ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemovePlayer(player.id)}
                className="text-red-600 border-red-200"
              >
                <Minus className="h-3 w-3" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddPlayer(player)}
                disabled={!canAdd}
                className="text-green-600 border-green-200"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
          <p className="font-medium text-sm">
            {player.first_name} {player.last_name}
          </p>
          <p className="text-xs text-gray-600">
            {player.team?.full_name || "Free Agent"}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl">
              {team ? "Edit Team" : "Create New Team"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Information Section */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-blue-800 flex items-center">
                  <Crown className="h-4 w-4 mr-2" />
                  Team Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Team Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={errors.name ? "border-red-400" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="playerCount">Max Players *</Label>
                    <Input
                      id="playerCount"
                      type="number"
                      min="1"
                      max="50"
                      value={formData.playerCount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          playerCount: Number(e.target.value) || 1,
                        }))
                      }
                      className={errors.playerCount ? "border-red-400" : ""}
                    />
                    {errors.playerCount && (
                      <p className="text-sm text-red-500">
                        {errors.playerCount}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          region: e.target.value,
                        }))
                      }
                      className={errors.region ? "border-red-400" : ""}
                    />
                    {errors.region && (
                      <p className="text-sm text-red-500">{errors.region}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    className={errors.country ? "border-red-400" : ""}
                  />
                  {errors.country && (
                    <p className="text-sm text-red-500">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-green-800 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Team Roster
                </h3>
                <Badge className="bg-green-500 text-white">
                  {formData.players.length} / {formData.playerCount}
                </Badge>
              </div>

              {formData.players.length > 0 && (
                <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                  {formData.players.map((player) => (
                    <div
                      key={`selected-${player.id}`}
                      className="flex items-center justify-between bg-white p-2 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <Badge>{player.position}</Badge>
                        <span className="text-sm font-medium">
                          {player.first_name} {player.last_name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemovePlayer(player.id)}
                        className="text-red-600 border-red-200"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Players Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Available Players
            </h4>
            <div className="max-h-60 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availablePlayers.map(renderPlayerCard)}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {team ? "Update Team" : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
