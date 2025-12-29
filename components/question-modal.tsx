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
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

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
      <DialogContent className="!w-[95vw] !max-w-[95vw] max-h-[90vh] bg-jeopardy-blue-light border-2 border-jeopardy-gold overflow-y-auto flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-jeopardy-gold text-xl">${question.points}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 overflow-y-auto flex-1">
          {/* Current Team Display */}
          {currentTeam && (
            <Card className="bg-jeopardy-gold/20 border-jeopardy-gold p-3 flex-shrink-0">
              <p className="text-xs text-jeopardy-gold/80 mb-1">Currently Asking:</p>
              <p className="text-lg lg:text-xl font-bold text-jeopardy-gold">{currentTeam.name}</p>
              {currentTeam.members.length > 0 && (
                <p className="text-xs text-jeopardy-gold/60 mt-1">{currentTeam.members.join(", ")}</p>
              )}
            </Card>
          )}

          {/* Question */}
          <Card className="bg-jeopardy-blue border-jeopardy-gold/30 p-4 lg:p-6 flex-shrink-0">
            {question.image && (
              <div className="mb-4 flex justify-center">
                <img
                  src={question.image}
                  alt="Question"
                  className="max-w-full max-h-[40vh] object-contain rounded-lg border-2 border-jeopardy-gold/50"
                />
              </div>
            )}
            <p className="text-xl lg:text-3xl xl:text-4xl text-center text-white font-medium leading-relaxed break-words">
              {question.question}
            </p>
          </Card>

          {/* Answer Options */}
          {question.answerOptions && question.answerOptions.length > 0 && !showAnswer && (
            <div className="space-y-2 flex-shrink-0">
              <Label className="text-white text-sm">Select an answer:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {question.answerOptions.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedOption(option)}
                    variant={selectedOption === option ? "default" : "outline"}
                    className={`
                      text-left justify-start h-auto py-3 px-4 text-base
                      ${
                        selectedOption === option
                          ? "bg-jeopardy-gold text-jeopardy-blue border-jeopardy-gold"
                          : "bg-jeopardy-blue/50 text-white border-jeopardy-gold/30 hover:bg-jeopardy-gold/20 hover:border-jeopardy-gold/50"
                      }
                    `}
                  >
                    <span className="font-semibold mr-2 text-jeopardy-gold">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Show Answer Button */}
          {!showAnswer && (
            <Button
              onClick={() => setShowAnswer(true)}
              disabled={question.answerOptions && question.answerOptions.length > 0 && !selectedOption}
              className="w-full bg-jeopardy-gold text-jeopardy-blue hover:bg-jeopardy-gold/90 text-sm py-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {question.answerOptions && question.answerOptions.length > 0
                ? selectedOption
                  ? "Reveal Answer"
                  : "Please select an answer first"
                : "Reveal Answer"}
            </Button>
          )}

          {/* Answer */}
          {showAnswer && (
            <Card className="bg-jeopardy-gold/20 border-jeopardy-gold p-4 lg:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-shrink-0 space-y-3">
              {question.answerOptions && question.answerOptions.length > 0 && selectedOption && (
                <div className="space-y-2">
                  <p className="text-sm text-jeopardy-gold/80">Your selection:</p>
                  <div
                    className={`p-3 rounded-lg border-2 ${
                      selectedOption.trim().toLowerCase() === question.answer.trim().toLowerCase()
                        ? "bg-green-500/20 border-green-500"
                        : "bg-red-500/20 border-red-500"
                    }`}
                  >
                    <p
                      className={`text-base lg:text-lg font-semibold ${
                        selectedOption.trim().toLowerCase() === question.answer.trim().toLowerCase()
                          ? "text-green-300"
                          : "text-red-300"
                      }`}
                    >
                      {selectedOption.trim().toLowerCase() === question.answer.trim().toLowerCase() ? "✓ Correct!" : "✗ Incorrect"}
                    </p>
                    <p className="text-white/80 text-sm mt-1">{selectedOption}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-jeopardy-gold/80 mb-2">Correct Answer:</p>
                <p className="text-lg lg:text-xl xl:text-2xl text-center text-jeopardy-gold font-bold break-words">{question.answer}</p>
              </div>
            </Card>
          )}

          {/* Scoring Controls */}
          {showAnswer && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 flex-shrink-0">
              <div className="space-y-2">
                <Label className="text-white text-sm">Select Team</Label>
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
                <Label className="text-white text-sm">Points</Label>
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
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2"
                >
                  Add Points
                </Button>
                <Button
                  onClick={() => handleAssignPoints(false)}
                  disabled={!selectedTeam}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10 text-sm py-2"
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
