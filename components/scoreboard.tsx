"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import type { Team } from "@/lib/types"

interface ScoreboardProps {
  teams: Team[]
  currentTeam: Team | null
  onUpdateScore: (teamId: string, points: number) => void
  onSetCurrentTeam?: (team: Team | null) => void
}

export function Scoreboard({ teams, currentTeam, onUpdateScore, onSetCurrentTeam }: ScoreboardProps) {
  if (teams.length === 0) {
    return (
      <Card className="bg-jeopardy-blue-light border-2 border-jeopardy-gold/30 p-3 py-3 mb-2 gap-0">
        <p className="text-center text-white/60 text-sm">No teams yet. Click "Manage Teams" to get started.</p>
      </Card>
    )
  }

  return (
    <div className="mb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      {teams.map((team) => (
        <Card
          key={team.id}
          onClick={() => onSetCurrentTeam?.(currentTeam?.id === team.id ? null : team)}
          className={`bg-jeopardy-blue-light border-2 p-2 py-2 transition-all gap-0 cursor-pointer ${
            currentTeam?.id === team.id
              ? "border-jeopardy-gold ring-2 ring-jeopardy-gold ring-offset-2 ring-offset-jeopardy-blue"
              : "border-jeopardy-gold hover:border-jeopardy-gold/80"
          }`}
        >
          <div className="text-center mb-2">
            <h3 className="text-base font-bold text-white mb-0.5">
              {team.name}
              {currentTeam?.id === team.id && (
                <span className="ml-2 text-xs text-jeopardy-gold">(Current)</span>
              )}
            </h3>
            {team.members.length > 0 && <p className="text-xs text-white/60">{team.members.join(", ")}</p>}
          </div>
          <div className="text-center mb-2">
            <span className="text-2xl font-bold text-jeopardy-gold">${team.score}</span>
          </div>
          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              onClick={() => onUpdateScore(team.id, 100)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-xs h-6 px-2"
            >
              <Plus className="h-2.5 w-2.5 mr-0.5" />
              100
            </Button>
            <Button
              size="sm"
              onClick={() => onUpdateScore(team.id, -100)}
              variant="outline"
              className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10 text-xs h-6 px-2"
            >
              <Minus className="h-2.5 w-2.5 mr-0.5" />
              100
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
