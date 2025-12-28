"use client"

import { Card } from "@/components/ui/card"
import type { Category, Question } from "@/lib/types"

interface GameBoardProps {
  categories: Category[]
  questions: Question[]
  onQuestionClick: (question: Question) => void
}

const POINT_VALUES = [100, 200, 300, 400, 500]

export function GameBoard({ categories, questions, onQuestionClick }: GameBoardProps) {
  const getQuestionForCell = (categoryId: string, points: number) => {
    return questions.find((q) => q.categoryId === categoryId && q.points === points)
  }

  return (
    <div className="h-full overflow-auto">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}>
        {/* Category Headers */}
        {categories.map((category) => (
          <Card key={category.id} className="bg-jeopardy-blue-light border-2 border-jeopardy-gold p-2 py-2 text-center gap-0">
            <h3 className="text-sm lg:text-base font-bold text-jeopardy-gold uppercase tracking-wide">
              {category.name}
            </h3>
          </Card>
        ))}

        {/* Question Tiles */}
        {POINT_VALUES.map((points) =>
          categories.map((category) => {
            const question = getQuestionForCell(category.id, points)
            const isUsed = question?.used || false

            return (
              <Card
                key={`${category.id}-${points}`}
                onClick={() => question && onQuestionClick(question)}
                className={`
                  aspect-square flex items-center justify-center cursor-pointer
                  transition-all duration-300 border-2 border-jeopardy-gold p-2 py-2 gap-0
                  ${
                    isUsed
                      ? "bg-jeopardy-blue/30 opacity-40 cursor-not-allowed"
                      : "bg-jeopardy-blue-light hover:bg-jeopardy-gold/20 hover:scale-105 active:scale-95"
                  }
                `}
              >
                <span
                  className={`text-2xl lg:text-3xl font-bold ${isUsed ? "text-jeopardy-gold/30" : "text-jeopardy-gold"}`}
                >
                  {isUsed ? "—" : `$${points}`}
                </span>
              </Card>
            )
          }),
        )}
      </div>
    </div>
  )
}
