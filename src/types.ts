export interface StudyQuestionnaire {
  subject: string;
  currentLevel: "beginner" | "intermediate" | "advanced";
  hoursPerWeek: number;
  durationWeeks: 2 | 4 | 6 | 8;
  learningStyle: "visual" | "practical" | "reading" | "auditory";
  goal: string;
}

export interface PracticeQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // The exact text of the correct option
  explanation: string;
}

export interface StudyTopic {
  name: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface SuggestionResource {
  title: string;
  type: "Video Course" | "Article/Textbook" | "Interactive Lab" | "Practice Repo" | "Podcast/Audio" | "Interactive Exercise";
  suggestedSearch: string;
  description: string;
}

export interface WeeklyMilestone {
  title: string;
  description: string;
  weekIndex: number; // 1-based index
}

export interface WeekPlan {
  weekNumber: number;
  theme: string;
  weeklyObjective: string;
  estimatedHours: number;
  topics: StudyTopic[];
  resources: SuggestionResource[];
  deliverable: {
    title: string;
    description: string;
  };
  quiz: PracticeQuizQuestion[];
}

export interface StudyPlan {
  title: string;
  description: string;
  summary: {
    totalWeeks: number;
    hoursPerWeek: number;
    learningStyleFocus: string;
    overallGoal: string;
  };
  estimatedCompletionTime: string;
  tips: string[];
  milestones: WeeklyMilestone[];
  weeks: WeekPlan[];
}

export interface UserProgress {
  completedTopics: string[]; // key format: "week-topicIdx" or "week-topicName"
  completedDeliverables: number[]; // Array of weekNumbers
  quizScores: { [weekNumber: number]: { score: number; total: number; selectedAnswers: number[] } };
  notes: { [key: string]: string }; // Custom notes per study topic
}
