"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, X } from "lucide-react"
import type { Team } from "@/lib/types"

interface TeamManagerProps {
  teams: Team[]
  onTeamsChange: (teams: Team[]) => void
}

export function TeamManager({ teams, onTeamsChange }: TeamManagerProps) {
  const [newTeamName, setNewTeamName] = useState("")
  const [editingTeam, setEditingTeam] = useState<string | null>(null)
  const [memberInput, setMemberInput] = useState("")

  const addTeam = () => {
    if (newTeamName.trim()) {
      const newTeam: Team = {
        id: Date.now().toString(),
        name: newTeamName.trim(),
        members: [],
        score: 0,
      }
      onTeamsChange([...teams, newTeam])
      setNewTeamName("")
    }
  }

  const deleteTeam = (teamId: string) => {
    onTeamsChange(teams.filter((t) => t.id !== teamId))
  }

  const addMember = (teamId: string) => {
    if (memberInput.trim()) {
      onTeamsChange(
        teams.map((team) => (team.id === teamId ? { ...team, members: [...team.members, memberInput.trim()] } : team)),
      )
      setMemberInput("")
    }
  }

  const removeMember = (teamId: string, memberIndex: number) => {
    onTeamsChange(
      teams.map((team) =>
        team.id === teamId ? { ...team, members: team.members.filter((_, i) => i !== memberIndex) } : team,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Add New Team */}
      <div className="space-y-2">
        <Label className="text-white">Add New Team</Label>
        <div className="flex gap-2">
          <Input
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTeam()}
            placeholder="Team name..."
            className="bg-jeopardy-blue text-white border-jeopardy-gold/30"
          />
          <Button onClick={addTeam} className="bg-jeopardy-gold text-jeopardy-blue hover:bg-jeopardy-gold/90">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Teams List */}
      <div className="space-y-3">
        {teams.map((team) => (
          <Card key={team.id} className="bg-jeopardy-blue border-jeopardy-gold/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-jeopardy-gold">{team.name}</h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingTeam(editingTeam === team.id ? null : team.id)}
                  className="border-jeopardy-gold/30 text-white hover:bg-jeopardy-gold/20"
                >
                  {editingTeam === team.id ? "Done" : "Edit Members"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteTeam(team.id)}
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Members */}
            {team.members.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {team.members.map((member, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-jeopardy-gold/20 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {member}
                    {editingTeam === team.id && (
                      <button onClick={() => removeMember(team.id, idx)} className="hover:text-red-400">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* Add Member Input */}
            {editingTeam === team.id && (
              <div className="flex gap-2 mt-3">
                <Input
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMember(team.id)}
                  placeholder="Member name..."
                  className="bg-jeopardy-blue-light text-white border-jeopardy-gold/30"
                />
                <Button
                  size="sm"
                  onClick={() => addMember(team.id)}
                  className="bg-jeopardy-gold text-jeopardy-blue hover:bg-jeopardy-gold/90"
                >
                  Add
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {teams.length === 0 && <p className="text-center text-white/60">No teams yet. Add your first team above!</p>}
    </div>
  )
}
