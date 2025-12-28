"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Question, Team } from "@/lib/types"

interface QuestionModalProps {
  question: Question
  teams: Team[]
  currentTeam: Team | null
  onScoreUpdate: (teamId: string, points: number) => void
  onClose: () => void
}

export function QuestionModal({ question, teams, currentTeam, onScoreUpdate, onClose }: QuestionModalProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string>(currentTeam?.id || "")
  const [customPoints, setCustomPoints] = useState(question.points.toString())

  useEffect(() => {
    if (currentTeam) {
      setSelectedTeam(currentTeam.id)
    }
  }, [currentTeam])

  const handleAssignPoints = (positive: boolean) => {
    if (selectedTeam) {
      const points = positive ? Number.parseInt(customPoints) : -Number.parseInt(customPoints)
      onScoreUpdate(selectedTeam, points)
      onClose()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-jeopardy-blue-light border-2 border-jeopardy-gold">
        <DialogHeader>
          <DialogTitle className="text-jeopardy-gold text-xl">${question.points}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Team Display */}
          {currentTeam && (
            <Card className="bg-jeopardy-gold/20 border-jeopardy-gold p-4">
              <p className="text-sm text-jeopardy-gold/80 mb-1">Currently Asking:</p>
              <p className="text-xl lg:text-2xl font-bold text-jeopardy-gold">{currentTeam.name}</p>
              {currentTeam.members.length > 0 && (
                <p className="text-sm text-jeopardy-gold/60 mt-1">{currentTeam.members.join(", ")}</p>
              )}
            </Card>
          )}

          {/* Question */}
          <Card className="bg-jeopardy-blue border-jeopardy-gold/30 p-8">
            <p className="text-2xl lg:text-4xl text-center text-white font-medium leading-relaxed">
              {question.question}
            </p>
          </Card>

          {/* Show Answer Button */}
          {!showAnswer && (
            <Button
              onClick={() => setShowAnswer(true)}
              className="w-full bg-jeopardy-gold text-jeopardy-blue hover:bg-jeopardy-gold/90 text-sm py-3"
            >
              Reveal Answer
            </Button>
          )}

          {/* Answer */}
          {showAnswer && (
            <Card className="bg-jeopardy-gold/20 border-jeopardy-gold p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-xl lg:text-2xl text-center text-jeopardy-gold font-bold">{question.answer}</p>
            </Card>
          )}

          {/* Scoring Controls */}
          {showAnswer && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <div className="space-y-2">
                <Label className="text-white">Select Team</Label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="bg-jeopardy-blue text-white border-jeopardy-gold/30">
                    <SelectValue placeholder="Choose a team..." />
                  </SelectTrigger>
                  <SelectContent className="bg-jeopardy-blue-light border-jeopardy-gold">
                    {teams.map((team) => (
                      <SelectItem
                        key={team.id}
                        value={team.id}
                        className="text-white focus:bg-jeopardy-gold/20 focus:text-white"
                      >
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Points</Label>
                <Input
                  type="number"
                  value={customPoints}
                  onChange={(e) => setCustomPoints(e.target.value)}
                  className="bg-jeopardy-blue text-white border-jeopardy-gold/30"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleAssignPoints(true)}
                  disabled={!selectedTeam}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-3"
                >
                  Add Points
                </Button>
                <Button
                  onClick={() => handleAssignPoints(false)}
                  disabled={!selectedTeam}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10 text-sm py-3"
                >
                  Subtract Points
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
