"use client";

import { CategoryManager } from "@/components/category-manager";
import { GameBoard } from "@/components/game-board";
import { QuestionModal } from "@/components/question-modal";
import { Scoreboard } from "@/components/scoreboard";
import { TeamManager } from "@/components/team-manager";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category, Question, Team } from "@/lib/types";
import { Plus, RotateCcw, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEYS = {
  categories: "jeopardy_categories",
  questions: "jeopardy_questions",
  teams: "jeopardy_teams",
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export default function JeopardyGame() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [finalQuestion, setFinalQuestion] = useState({
    question: "",
    answer: "",
  });
  const [showFinalQuestion, setShowFinalQuestion] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCategories = loadFromStorage<Category[]>(
      STORAGE_KEYS.categories,
      []
    );
    const savedQuestions = loadFromStorage<Question[]>(
      STORAGE_KEYS.questions,
      []
    );
    const savedTeams = loadFromStorage<Team[]>(STORAGE_KEYS.teams, []);

    setCategories(savedCategories);
    setQuestions(savedQuestions);
    setTeams(savedTeams);
    setIsInitialized(true);
  }, []);

  // Save categories to localStorage whenever they change (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveToStorage(STORAGE_KEYS.categories, categories);
    }
  }, [categories, isInitialized]);

  // Save questions to localStorage whenever they change (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveToStorage(STORAGE_KEYS.questions, questions);
    }
  }, [questions, isInitialized]);

  // Save teams to localStorage whenever they change (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveToStorage(STORAGE_KEYS.teams, teams);
    }
  }, [teams, isInitialized]);

  const handleClearAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.categories);
    localStorage.removeItem(STORAGE_KEYS.questions);
    localStorage.removeItem(STORAGE_KEYS.teams);
    setCategories([]);
    setQuestions([]);
    setTeams([]);
    setShowClearDataDialog(false);
  };

  const handleQuestionClick = (question: Question) => {
    if (!question.used) {
      setSelectedQuestion(question);
    }
  };

  const handleScoreUpdate = (teamId: string, points: number) => {
    const updatedTeams = teams.map((team) =>
      team.id === teamId ? { ...team, score: team.score + points } : team
    );
    setTeams(updatedTeams);
    if (selectedQuestion) {
      const updatedQuestions = questions.map((q) =>
        q.id === selectedQuestion.id ? { ...q, used: true } : q
      );
      setQuestions(updatedQuestions);
      setSelectedQuestion(null);
      setCurrentTeam(null);
    }
  };

  const handleCloseQuestion = () => {
    setSelectedQuestion(null);
    setCurrentTeam(null);
  };

  const handleResetBoard = () => {
    const resetQuestions = questions.map((q) => ({ ...q, used: false }));
    setQuestions(resetQuestions);
    setShowResetDialog(false);
  };

  const handleFullReset = () => {
    const resetQuestions = questions.map((q) => ({ ...q, used: false }));
    const resetTeams = teams.map((team) => ({ ...team, score: 0 }));
    setQuestions(resetQuestions);
    setTeams(resetTeams);
    setShowResetDialog(false);
  };

  return (
    <div className="h-screen bg-jeopardy-blue text-white flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 py-2 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="mb-2 text-center flex-shrink-0">
          <h1 className="text-2xl lg:text-4xl font-bold tracking-tight mb-0.5 text-jeopardy-gold font-jeopardy">
            JEOPARDY 3G!
          </h1>
        </div>

        <div className="mb-2 flex flex-wrap gap-1.5 justify-center flex-shrink-0 mt-2">
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
          <Button
            onClick={() => setShowClearDataDialog(true)}
            variant="outline"
            size="sm"
            className="bg-white/10 text-white border-red-500/50 hover:bg-red-500 hover:text-white text-xs h-6 px-2"
          >
            <Trash2 className="mr-1 h-2.5 w-2.5" />
            Clear All Data
          </Button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden mt-2">
          <div className="flex-shrink-0">
            <Scoreboard
              teams={teams}
              currentTeam={currentTeam}
              onUpdateScore={(teamId, points) => {
                setTeams(
                  teams.map((team) =>
                    team.id === teamId
                      ? { ...team, score: team.score + points }
                      : team
                  )
                );
              }}
              onSetCurrentTeam={setCurrentTeam}
            />
          </div>

          {/* Game Board */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <GameBoard
              categories={categories}
              questions={questions}
              onQuestionClick={handleQuestionClick}
            />
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
              <DialogTitle className="text-jeopardy-gold text-2xl">
                Team Management
              </DialogTitle>
            </DialogHeader>
            <TeamManager teams={teams} onTeamsChange={setTeams} />
          </DialogContent>
        </Dialog>

        {/* Category Manager Dialog */}
        <Dialog
          open={showCategoryManager}
          onOpenChange={setShowCategoryManager}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-jeopardy-blue-light border-jeopardy-gold">
            <DialogHeader>
              <DialogTitle className="text-jeopardy-gold text-2xl">
                Category & Question Management
              </DialogTitle>
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
              <DialogTitle className="text-jeopardy-gold">
                Reset Game
              </DialogTitle>
              <DialogDescription className="text-white/80">
                Choose how you want to reset the game
              </DialogDescription>
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
              <DialogTitle className="text-jeopardy-gold text-2xl">
                Final Jeopardy!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Question</Label>
                <Textarea
                  value={finalQuestion.question}
                  onChange={(e) =>
                    setFinalQuestion({
                      ...finalQuestion,
                      question: e.target.value,
                    })
                  }
                  placeholder="Enter final question..."
                  className="bg-jeopardy-blue text-white border-jeopardy-gold/30"
                />
              </div>
              <div>
                <Label className="text-white">Answer</Label>
                <Input
                  value={finalQuestion.answer}
                  onChange={(e) =>
                    setFinalQuestion({
                      ...finalQuestion,
                      answer: e.target.value,
                    })
                  }
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
                          const points = Number.parseInt(
                            (e.target as HTMLInputElement).value
                          );
                          if (!isNaN(points)) {
                            handleScoreUpdate(team.id, points);
                            (e.target as HTMLInputElement).value = "";
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

        {/* Clear All Data Dialog */}
        <Dialog
          open={showClearDataDialog}
          onOpenChange={setShowClearDataDialog}
        >
          <DialogContent className="bg-jeopardy-blue-light border-red-500">
            <DialogHeader>
              <DialogTitle className="text-red-400">Clear All Data</DialogTitle>
              <DialogDescription className="text-white/80">
                This will permanently delete all categories, questions, teams,
                and scores from localStorage. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 py-4">
              <Button
                onClick={handleClearAllData}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-sm py-2"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Yes, Delete All Data
              </Button>
              <Button
                onClick={() => setShowClearDataDialog(false)}
                size="sm"
                className="bg-jeopardy-gold text-jeopardy-blue hover:bg-jeopardy-gold/90 text-sm py-2"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
