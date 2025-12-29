"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react"
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
    image: "" as string | undefined,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }
      
      // Check file size (limit to 5MB to avoid localStorage issues)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setNewQuestion({ ...newQuestion, image: base64String })
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setNewQuestion({ ...newQuestion, image: undefined })
    setImagePreview(null)
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
        image: newQuestion.image,
      }
      onQuestionsChange([...questions, question])
      setNewQuestion({
        categoryId: newQuestion.categoryId,
        points: "100",
        question: "",
        answer: "",
        image: undefined,
      })
      setImagePreview(null)
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

        <div className="space-y-2">
          <Label className="text-white">Image (Optional)</Label>
          <div className="space-y-2">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-48 object-contain rounded-lg border border-jeopardy-gold/30"
                />
                <Button
                  type="button"
                  onClick={removeImage}
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-red-500/80 border-red-500 text-white hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-jeopardy-gold/30 rounded-lg cursor-pointer hover:border-jeopardy-gold/50 transition-colors bg-jeopardy-blue/50">
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-jeopardy-gold/60 mb-2" />
                  <span className="text-sm text-white/70">Click to upload image</span>
                  <span className="text-xs text-white/50 mt-1">Max 5MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
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
                    {question.image && (
                      <>
                        <span className="text-white/60">•</span>
                        <ImageIcon className="h-4 w-4 text-jeopardy-gold/60" />
                      </>
                    )}
                  </div>
                  {question.image && (
                    <div className="my-2">
                      <img
                        src={question.image}
                        alt="Question image"
                        className="max-w-full max-h-32 object-contain rounded-lg border border-jeopardy-gold/30"
                      />
                    </div>
                  )}
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
