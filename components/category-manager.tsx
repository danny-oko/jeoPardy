"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category, Question } from "@/lib/types"

interface CategoryManagerProps {
  categories: Category[]
  questions: Question[]
  onCategoriesChange: (categories: Category[]) => void
  onQuestionsChange: (questions: Question[]) => void
}

export function CategoryManager({
  categories,
  questions,
  onCategoriesChange,
  onQuestionsChange,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newQuestion, setNewQuestion] = useState({
    categoryId: "",
    points: "100",
    question: "",
    answer: "",
  })

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const category: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
      }
      onCategoriesChange([...categories, category])
      setNewCategoryName("")
    }
  }

  const deleteCategory = (categoryId: string) => {
    onCategoriesChange(categories.filter((c) => c.id !== categoryId))
    onQuestionsChange(questions.filter((q) => q.categoryId !== categoryId))
  }

  const addQuestion = () => {
    if (newQuestion.categoryId && newQuestion.question.trim() && newQuestion.answer.trim()) {
      const question: Question = {
        id: Date.now().toString(),
        categoryId: newQuestion.categoryId,
        points: Number.parseInt(newQuestion.points),
        question: newQuestion.question.trim(),
        answer: newQuestion.answer.trim(),
        used: false,
      }
      onQuestionsChange([...questions, question])
      setNewQuestion({
        categoryId: newQuestion.categoryId,
        points: "100",
        question: "",
        answer: "",
      })
    }
  }

  const deleteQuestion = (questionId: string) => {
    onQuestionsChange(questions.filter((q) => q.id !== questionId))
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown"
  }

  return (
    <div className="space-y-8">
      {/* Add Category */}
      <div className="space-y-2">
        <Label className="text-jeopardy-gold text-lg">Add Category</Label>
        <div className="flex gap-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="Category name..."
            className="bg-jeopardy-blue text-white border-jeopardy-gold/30 placeholder:text-white/50"
          />
          <Button onClick={addCategory} className="bg-jeopardy-gold text-jeopardy-blue hover:bg-jeopardy-gold/90">
            <Plus className="h-4 w-4 mr-1 text-jeopardy-blue" />
            Add
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <div>
        <Label className="text-jeopardy-gold text-lg mb-3 block">Current Categories</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="inline-flex items-center gap-2 bg-jeopardy-blue border border-jeopardy-gold/30 px-4 py-2 rounded-lg"
            >
              <span className="text-white">{category.name}</span>
              <button onClick={() => deleteCategory(category.id)} className="text-red-400 hover:text-red-300 transition-colors">
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Question */}
      <div className="space-y-4 border-t border-jeopardy-gold/30 pt-6">
        <Label className="text-jeopardy-gold text-lg">Add Question</Label>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Category</Label>
            <Select
              value={newQuestion.categoryId}
              onValueChange={(value) => setNewQuestion({ ...newQuestion, categoryId: value })}
            >
              <SelectTrigger className="bg-jeopardy-blue text-white border-jeopardy-gold/30">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent className="bg-jeopardy-blue-light border-jeopardy-gold">
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="text-white focus:bg-jeopardy-gold/20 focus:text-white"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Points</Label>
            <Select
              value={newQuestion.points}
              onValueChange={(value) => setNewQuestion({ ...newQuestion, points: value })}
            >
              <SelectTrigger className="bg-jeopardy-blue text-white border-jeopardy-gold/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-jeopardy-blue-light border-jeopardy-gold">
                {[100, 200, 300, 400, 500].map((points) => (
                  <SelectItem
                    key={points}
                    value={points.toString()}
                    className="text-white focus:bg-jeopardy-gold/20 focus:text-white"
                  >
                    ${points}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Question</Label>
          <Textarea
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            placeholder="Enter question..."
            className="bg-jeopardy-blue text-white border-jeopardy-gold/30 placeholder:text-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Answer</Label>
          <Input
            value={newQuestion.answer}
            onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
            placeholder="Enter answer..."
            className="bg-jeopardy-blue text-white border-jeopardy-gold/30 placeholder:text-white/50"
          />
        </div>

        <Button onClick={addQuestion} className="w-full bg-jeopardy-gold text-jeopardy-blue hover:bg-jeopardy-gold/90">
          <Plus className="h-4 w-4 mr-1 text-jeopardy-blue" />
          Add Question
        </Button>
      </div>

      {/* Questions List */}
      <div className="border-t border-jeopardy-gold/30 pt-6">
        <Label className="text-jeopardy-gold text-lg mb-4 block">All Questions</Label>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {questions.map((question) => (
            <Card key={question.id} className="bg-jeopardy-blue border-jeopardy-gold/30 p-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-jeopardy-gold font-bold">${question.points}</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/80">{getCategoryName(question.categoryId)}</span>
                  </div>
                  <p className="text-white">{question.question}</p>
                  <p className="text-jeopardy-gold/80 text-sm">→ {question.answer}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteQuestion(question.id)}
                  className="bg-jeopardy-blue border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
