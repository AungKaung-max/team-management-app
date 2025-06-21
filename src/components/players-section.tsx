"use client";

import { useApp } from "@/app/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Loader2, MapPin, User } from "lucide-react";
import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export function PlayersSection() {
  const {
    players,
    loading,
    error,
    fetchPlayers,
    hasMore,
    isPlayerInTeam,
    getTeamByPlayer,
  } = useApp();

  useEffect(() => {
    if (players.length === 0) {
      fetchPlayers();
    }
  }, [fetchPlayers, players.length, loading]);

  return (
    <InfiniteScroll
      dataLength={players.length}
      next={fetchPlayers}
      hasMore={hasMore && !error}
      loader={
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-600">Loading more players...</p>
          </div>
        </div>
      }
      scrollThreshold={0.9}
      style={{ overflow: "visible" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.map((player, index) => {
          const playerTeam = getTeamByPlayer(player.id);
          const inTeam = isPlayerInTeam(player.id);
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {player.first_name} {player.last_name}
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">{player.country || "USA"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {inTeam && playerTeam && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white bg-green-500">
                      <Award className="h-3 w-3 mr-1" />
                      {playerTeam.name}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    NBA Team
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {player.team?.full_name || "Free Agent"}
                  </div>
                  {player.team?.city && (
                    <div className="text-xs text-gray-600">
                      {player.team.city} • {player.team.conference}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </InfiniteScroll>
  );
}
