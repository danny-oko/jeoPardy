export interface Team {
  id: string
  name: string
  members: string[]
  score: number
}

export interface Category {
  id: string
  name: string
}

export interface Question {
  id: string
  categoryId: string
  points: number
  question: string
  answer: string
  used: boolean
}
