"use client"

import { useState } from "react"
import { Plus, RotateCcw, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Scoreboard } from "@/components/scoreboard"
import { GameBoard } from "@/components/game-board"
import { TeamManager } from "@/components/team-manager"
import { CategoryManager } from "@/components/category-manager"
import { QuestionModal } from "@/components/question-modal"
import type { Team, Question, Category } from "@/lib/types"

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Science" },
  { id: "2", name: "History" },
  { id: "3", name: "Sports" },
  { id: "4", name: "Geography" },
  { id: "5", name: "Pop Culture" },
]

const DEFAULT_QUESTIONS: Question[] = [
  { id: "1", categoryId: "1", points: 100, question: "What is H2O?", answer: "Water", used: false },
  {
    id: "2",
    categoryId: "1",
    points: 200,
    question: "What planet is closest to the sun?",
    answer: "Mercury",
    used: false,
  },
  {
    id: "3",
    categoryId: "2",
    points: 100,
    question: "Who was the first president of the USA?",
    answer: "George Washington",
    used: false,
  },
  {
    id: "4",
    categoryId: "3",
    points: 100,
    question: "How many players are on a basketball team?",
    answer: "5",
    used: false,
  },
  { id: "5", categoryId: "4", points: 100, question: "What is the capital of France?", answer: "Paris", used: false },
]

export default function JeopardyGame() {
  const [teams, setTeams] = useState<Team[]>([])
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [showTeamManager, setShowTeamManager] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [finalQuestion, setFinalQuestion] = useState({ question: "", answer: "" })
  const [showFinalQuestion, setShowFinalQuestion] = useState(false)

  const handleQuestionClick = (question: Question) => {
    if (!question.used) {
      setSelectedQuestion(question)
    }
  }

  const handleScoreUpdate = (teamId: string, points: number) => {
    setTeams(teams.map((team) => (team.id === teamId ? { ...team, score: team.score + points } : team)))
    if (selectedQuestion) {
      setQuestions(questions.map((q) => (q.id === selectedQuestion.id ? { ...q, used: true } : q)))
      setSelectedQuestion(null)
      setCurrentTeam(null)
    }
  }

  const handleCloseQuestion = () => {
    setSelectedQuestion(null)
    setCurrentTeam(null)
  }

  const handleResetBoard = () => {
    setQuestions(questions.map((q) => ({ ...q, used: false })))
    setShowResetDialog(false)
  }

  const handleFullReset = () => {
    setQuestions(questions.map((q) => ({ ...q, used: false })))
    setTeams(teams.map((team) => ({ ...team, score: 0 })))
    setShowResetDialog(false)
  }

  return (
    <div className="h-screen bg-jeopardy-blue text-white flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 py-2 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="mb-2 text-center flex-shrink-0">
          <h1
            className="text-2xl lg:text-4xl font-bold tracking-tight mb-0.5 text-jeopardy-gold"
            style={{ fontFamily: "serif" }}
          >
            JEOPARDY!
          </h1>
          <p className="text-xs lg:text-sm text-white/80">Host-Controlled Quiz Game</p>
        </div>

        {/* Control Panel */}
        <div className="mb-2 flex flex-wrap gap-1.5 justify-center flex-shrink-0">
          <Button
            onClick={() => setShowTeamManager(true)}
            variant="outline"
            size="sm"
            className="bg-white/10 text-white border-jeopardy-gold/50 hover:bg-jeopardy-gold hover:text-jeopardy-blue text-xs h-6 px-2"
          >
            <Users className="mr-1 h-2.5 w-2.5" />
            Manage Teams
          </Button>
          <Button
            onClick={() => setShowCategoryManager(true)}
            variant="outline"
            size="sm"
            className="bg-white/10 text-white border-jeopardy-gold/50 hover:bg-jeopardy-gold hover:text-jeopardy-blue text-xs h-6 px-2"
          >
            <Plus className="mr-1 h-2.5 w-2.5" />
            Manage Categories
          </Button>
          <Button
            onClick={() => setShowResetDialog(true)}
            variant="outline"
            size="sm"
            className="bg-white/10 text-white border-jeopardy-gold/50 hover:bg-jeopardy-gold hover:text-jeopardy-blue text-xs h-6 px-2"
          >
            <RotateCcw className="mr-1 h-2.5 w-2.5" />
            Reset Game
          </Button>
          <Button
            onClick={() => setShowFinalQuestion(true)}
            variant="outline"
            size="sm"
            className="bg-white/10 text-white border-jeopardy-gold/50 hover:bg-jeopardy-gold hover:text-jeopardy-blue text-xs h-6 px-2"
          >
            Final Question
          </Button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
          {/* Scoreboard */}
          <div className="flex-shrink-0">
            <Scoreboard
              teams={teams}
              currentTeam={currentTeam}
              onUpdateScore={(teamId, points) => {
                setTeams(teams.map((team) => (team.id === teamId ? { ...team, score: team.score + points } : team)))
              }}
              onSetCurrentTeam={setCurrentTeam}
            />
          </div>

          {/* Game Board */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <GameBoard categories={categories} questions={questions} onQuestionClick={handleQuestionClick} />
          </div>
        </div>

        {/* Question Modal */}
        {selectedQuestion && (
          <QuestionModal
            question={selectedQuestion}
            teams={teams}
            currentTeam={currentTeam}
            onScoreUpdate={handleScoreUpdate}
            onClose={handleCloseQuestion}
          />
        )}

        {/* Team Manager Dialog */}
        <Dialog open={showTeamManager} onOpenChange={setShowTeamManager}>
          <DialogContent className="max-w-2xl bg-jeopardy-blue-light border-jeopardy-gold">
            <DialogHeader>
              <DialogTitle className="text-jeopardy-gold text-2xl">Team Management</DialogTitle>
            </DialogHeader>
            <TeamManager teams={teams} onTeamsChange={setTeams} />
          </DialogContent>
        </Dialog>

        {/* Category Manager Dialog */}
        <Dialog open={showCategoryManager} onOpenChange={setShowCategoryManager}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-jeopardy-blue-light border-jeopardy-gold">
            <DialogHeader>
              <DialogTitle className="text-jeopardy-gold text-2xl">Category & Question Management</DialogTitle>
            </DialogHeader>
            <CategoryManager
              categories={categories}
              questions={questions}
              onCategoriesChange={setCategories}
              onQuestionsChange={setQuestions}
            />
          </DialogContent>
        </Dialog>

        {/* Reset Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent className="bg-jeopardy-blue-light border-jeopardy-gold">
            <DialogHeader>
              <DialogTitle className="text-jeopardy-gold">Reset Game</DialogTitle>
              <DialogDescription className="text-white/80">Choose how you want to reset the game</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 py-4">
              <Button
                onClick={handleResetBoard}
                size="sm"
                className="bg-jeopardy-gold text-jeopardy-blue hover:bg-jeopardy-gold/90 text-sm py-2"
              >
                Reset Board Only (Keep Scores)
              </Button>
              <Button
                onClick={handleFullReset}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent text-sm py-2"
              >
                Full Reset (Board + Scores)
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Final Question Dialog */}
        <Dialog open={showFinalQuestion} onOpenChange={setShowFinalQuestion}>
          <DialogContent className="bg-jeopardy-blue-light border-jeopardy-gold">
            <DialogHeader>
              <DialogTitle className="text-jeopardy-gold text-2xl">Final Jeopardy!</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Question</Label>
                <Textarea
                  value={finalQuestion.question}
                  onChange={(e) => setFinalQuestion({ ...finalQuestion, question: e.target.value })}
                  placeholder="Enter final question..."
                  className="bg-jeopardy-blue text-white border-jeopardy-gold/30"
                />
              </div>
              <div>
                <Label className="text-white">Answer</Label>
                <Input
                  value={finalQuestion.answer}
                  onChange={(e) => setFinalQuestion({ ...finalQuestion, answer: e.target.value })}
                  placeholder="Enter answer..."
                  className="bg-jeopardy-blue text-white border-jeopardy-gold/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Assign Points to Teams</Label>
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center gap-2">
                    <span className="flex-1 text-white">{team.name}</span>
                    <Input
                      type="number"
                      placeholder="Points"
                      className="w-32 bg-jeopardy-blue text-white border-jeopardy-gold/30"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const points = Number.parseInt((e.target as HTMLInputElement).value)
                          if (!isNaN(points)) {
                            handleScoreUpdate(team.id, points)
                            ;(e.target as HTMLInputElement).value = ""
                          }
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
