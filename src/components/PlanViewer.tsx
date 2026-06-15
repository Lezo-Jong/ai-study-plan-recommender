import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  BookMarked,
  SquarePen,
  FileText,
  Compass,
  CheckSquare,
  HelpCircle,
  Lightbulb,
  ArrowLeft,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BarChart3
} from "lucide-react";
import { StudyPlan, UserProgress, WeekPlan, PracticeQuizQuestion, StudyTopic } from "../types";

interface PlanViewerProps {
  plan: StudyPlan;
  onReset: () => void;
}

export default function PlanViewer({ plan, onReset }: PlanViewerProps) {
  // Load progress from local storage or set initial state
  const storageKey = `study_progress_${plan.title.replace(/\s+/g, "_")}`;
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Local storage progress parsing failed:", e);
    }
    return {
      completedTopics: [],
      completedDeliverables: [],
      quizScores: {},
      notes: {}
    };
  });

  const [activeWeekNum, setActiveWeekNum] = useState<number>(1);
  const [editingTopicKey, setEditingTopicKey] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "syllabus" | "quiz" | "notes">("syllabus");

  // Quiz active states
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const activeWeek = plan.weeks.find((w) => w.weekNumber === activeWeekNum) || plan.weeks[0];

  // Persists progress state helper
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem(storageKey, JSON.stringify(newProgress));
  };

  // Toggle topics completion
  const toggleTopicCompletion = (weekNum: number, topicIdx: number) => {
    const key = `w${weekNum}-t${topicIdx}`;
    const completed = [...progress.completedTopics];
    const index = completed.indexOf(key);
    if (index > -1) {
      completed.splice(index, 1);
    } else {
      completed.push(key);
    }
    saveProgress({ ...progress, completedTopics: completed });
  };

  // Toggle deliverable
  const toggleDeliverableCompletion = (weekNum: number) => {
    const completed = [...progress.completedDeliverables];
    const index = completed.indexOf(weekNum);
    if (index > -1) {
      completed.splice(index, 1);
    } else {
      completed.push(weekNum);
    }
    saveProgress({ ...progress, completedDeliverables: completed });
  };

  // Note actions
  const startEditingNote = (weekNum: number, topicIdx: number) => {
    const key = `w${weekNum}-t${topicIdx}`;
    setEditingTopicKey(key);
    setCurrentNoteText(progress.notes[key] || "");
  };

  const saveNote = () => {
    if (!editingTopicKey) return;
    const notes = { ...progress.notes, [editingTopicKey]: currentNoteText };
    saveProgress({ ...progress, notes });
    setEditingTopicKey(null);
  };

  // Quiz activities
  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
  };

  const handleSubmitQuiz = (weekNum: number, quizQuestions: PracticeQuizQuestion[]) => {
    if (Object.keys(selectedAnswers).length < quizQuestions.length) {
      alert("Please select answers for all the check questions before submitting!");
      return;
    }

    let correctCount = 0;
    const answerIndices: number[] = [];

    quizQuestions.forEach((q, idx) => {
      const selectedIndex = selectedAnswers[idx];
      answerIndices.push(selectedIndex);
      if (q.options[selectedIndex] === q.correctAnswer) {
        correctCount++;
      }
    });

    const newQuizScores = {
      ...progress.quizScores,
      [weekNum]: {
        score: correctCount,
        total: quizQuestions.length,
        selectedAnswers: answerIndices
      }
    };

    saveProgress({ ...progress, quizScores: newQuizScores });
    setQuizSubmitted(true);
  };

  const handleResetQuiz = (weekNum: number) => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    const newScores = { ...progress.quizScores };
    delete newScores[weekNum];
    saveProgress({ ...progress, quizScores: newScores });
  };

  // Calculate high-level progress stats
  const totalTopics = plan.weeks.reduce((sum, w) => sum + w.topics.length, 0);
  const completedTopicsCount = progress.completedTopics.length;
  const totalDeliverables = plan.weeks.length;
  const completedDeliverablesCount = progress.completedDeliverables.length;

  const overallProgressPercentage = Math.round(
    ((completedTopicsCount + completedDeliverablesCount) / (totalTopics + totalDeliverables)) * 100
  );

  // Helper to construct searchable URL
  const getSearchUrl = (query: string) => {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  const getYoutubeUrl = (query: string) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  };

  // Check if a specific quiz was already completed
  const hasSavedQuizScore = progress.quizScores[activeWeekNum] !== undefined;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Back button and title strip */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Create New Plan
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
            Style Focus: <span className="text-gray-700 capitalize">{plan.summary.learningStyleFocus}</span>
          </span>
          <span className="text-xs font-semibold text-gray-400 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-150">
            Commitment: <span>{plan.summary.hoursPerWeek}h/week for {plan.summary.totalWeeks} Weeks</span>
          </span>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear your learning checklist and quiz scores?")) {
                localStorage.removeItem(storageKey);
                setProgress({
                  completedTopics: [],
                  completedDeliverables: [],
                  quizScores: {},
                  notes: {}
                });
                alert("Progress reset successfully!");
              }
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-xl border border-dotted border-red-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Progress
          </button>
        </div>
      </div>

      {/* Hero Banner Area */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-6 md:p-10 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 mb-4 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Master Syllabus Activated
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            {plan.title}
          </h1>
          <p className="text-sm md:text-base text-indigo-200/95 leading-relaxed font-sans max-w-3xl">
            {plan.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-indigo-800/50">
            <div>
              <p className="text-xs text-indigo-350 font-medium">Estimated Time</p>
              <p className="text-sm md:text-base font-bold text-white mt-0.5">{plan.estimatedCompletionTime}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-350 font-medium">Overall Progress</p>
              <p className="text-sm md:text-base font-bold text-emerald-400 mt-0.5">{overallProgressPercentage}% Ready</p>
            </div>
            <div>
              <p className="text-xs text-indigo-350 font-medium">Completed Deliverables</p>
              <p className="text-sm md:text-base font-bold text-white mt-0.5">{completedDeliverablesCount} of {totalDeliverables}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-350 font-medium">Subject Goal</p>
              <p className="text-sm md:text-base font-bold text-indigo-300 truncate mt-0.5" title={plan.summary.overallGoal}>
                {plan.summary.overallGoal}
              </p>
            </div>
          </div>

          {/* Progress bar container */}
          <div className="mt-6 w-full bg-indigo-950 rounded-full h-2 overflow-hidden border border-indigo-800/60">
            <div
              className="bg-gradient-to-r from-emerald-400 to-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(3, overallProgressPercentage)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Week Selector, Quick Stats & Action Tips (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Week Selector Checklist */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" /> Plan Roadmap ({plan.weeks.length} Weeks)
            </h3>
            <div className="space-y-3">
              {plan.weeks.map((wk) => {
                const isActive = wk.weekNumber === activeWeekNum;
                // calculate how many topics completed in this week
                const weekTopicsCount = wk.topics.length;
                const weekTopicsCompleted = wk.topics.filter((_, idx) =>
                  progress.completedTopics.includes(`w${wk.weekNumber}-t${idx}`)
                ).length;
                const isDeliverableDone = progress.completedDeliverables.includes(wk.weekNumber);
                const isWeekFullyChecked = weekTopicsCompleted === weekTopicsCount && isDeliverableDone;

                return (
                  <button
                    key={wk.weekNumber}
                    onClick={() => {
                      setActiveWeekNum(wk.weekNumber);
                      // Reset local temporary quiz select states if navigating to another week
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                      // If quiz score was already submitted, we load the stored indicators
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 group relative cursor-pointer ${
                      isActive
                        ? "border-indigo-600 bg-indigo-50/20 shadow-md ring-1 ring-indigo-600"
                        : "border-gray-100 bg-gray-50/40 hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          Week {wk.weekNumber}
                        </span>
                        {isWeekFullyChecked && (
                          <span className="text-emerald-600 bg-emerald-50 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 border border-emerald-100 animate-pulse">
                            <CheckCircle className="w-2.5 h-2.5 fill-emerald-150" /> Done
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-800 truncate">{wk.theme}</p>
                      <p className="text-xs text-gray-400 mt-1 font-medium truncate">{wk.weeklyObjective}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-xs font-semibold text-indigo-600 mt-1">
                        {weekTopicsCompleted}/{weekTopicsCount} checked
                      </span>
                      {hasSavedQuizScore && (
                        <span className="text-[10px] font-bold text-gray-400">
                          Quiz: {progress.quizScores[wk.weekNumber]?.score}/{progress.quizScores[wk.weekNumber]?.total}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Milestones Box */}
          {plan.milestones && plan.milestones.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-500" /> Core Milestones
              </h3>
              <div className="relative border-l-2 border-indigo-50 pl-4 ml-2 py-1 space-y-5">
                {plan.milestones.map((milestone, idx) => {
                  const isWeekPassed = activeWeekNum >= milestone.weekIndex;
                  return (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[25px] top-1 w-4.5 h-4.5 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                        isWeekPassed ? "border-indigo-600 scale-110 shadow-sm text-indigo-600 font-bold" : "border-gray-200"
                      }`}>
                        {isWeekPassed ? (
                          <CheckCircle className="w-3.5 h-3.5 bg-indigo-100 text-indigo-600 rounded-full" />
                        ) : (
                          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        )}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">Week {milestone.weekIndex} Trigger</span>
                        <h4 className="text-xs font-bold text-gray-800">{milestone.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed font-medium">{milestone.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Style Tips Box */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/50 rounded-3xl border border-indigo-100/50 p-6">
            <h3 className="text-sm font-bold text-indigo-950 tracking-tight flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Actionable Style Tips
            </h3>
            <ul className="space-y-3">
              {plan.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-indigo-900 leading-relaxed font-medium">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Week Details Hub (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs Menu inside details bar */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/50 border-b border-gray-150 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase">Active Week View</span>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Week {activeWeek.weekNumber}: {activeWeek.theme}
                </h2>
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Target Study commitment: {activeWeek.estimatedHours} Hours
              </span>
            </div>

            {/* Inner App Tab Panel Navigation */}
            <div className="flex border-b border-gray-100 bg-white">
              <button
                type="button"
                onClick={() => setActiveTab("syllabus")}
                className={`flex-1 py-4 text-center text-xs font-bold tracking-wide border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "syllabus"
                    ? "border-indigo-600 text-indigo-650 font-extrabold bg-indigo-50/5"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
              >
                <BookMarked className="w-4 h-4" /> Curriculum Checklist
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("quiz")}
                className={`flex-1 py-4 text-center text-xs font-bold tracking-wide border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "quiz"
                    ? "border-indigo-600 text-indigo-650 font-extrabold bg-indigo-50/5"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Weekly Concept Check
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-4 text-center text-xs font-bold tracking-wide border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "overview"
                    ? "border-indigo-600 text-indigo-650 font-extrabold bg-indigo-50/5"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
              >
                <Compass className="w-4 h-4" /> Custom Resources ({activeWeek.resources.length})
              </button>
            </div>

            {/* TAB CONTENT: Curriculum Checklist */}
            {activeTab === "syllabus" && (
              <div className="p-6 md:p-8 space-y-8">
                {/* Weekly Objective */}
                <div className="bg-indigo-50/45 rounded-2xl border border-indigo-150/40 p-5 flex gap-4 items-start">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">Weekly Core Objective</h4>
                    <p className="text-xs md:text-sm text-indigo-900/90 leading-relaxed font-medium mt-1">
                      {activeWeek.weeklyObjective}
                    </p>
                  </div>
                </div>

                {/* Study Topics checklist */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Focus Topics</h3>
                  <div className="space-y-4">
                    {activeWeek.topics.map((topic, idx) => {
                      const topicKey = `w${activeWeek.weekNumber}-t${idx}`;
                      const isCompleted = progress.completedTopics.includes(topicKey);
                      const hasNote = !!progress.notes[topicKey];

                      return (
                        <div
                          key={idx}
                          className={`border rounded-2xl transition-all ${
                            isCompleted ? "border-emerald-100 bg-emerald-50/5" : "border-gray-150 bg-white"
                          }`}
                        >
                          <div className="p-4 flex items-start gap-4 justify-between">
                            <div className="flex gap-3 items-start flex-1">
                              <button
                                type="button"
                                onClick={() => toggleTopicCompletion(activeWeek.weekNumber, idx)}
                                className="mt-0.5 text-gray-400 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer"
                              >
                                {isCompleted ? (
                                  <CheckCircle className="w-5.5 h-5.5 text-emerald-500 fill-emerald-50" />
                                ) : (
                                  <Circle className="w-5.5 h-5.5 text-gray-300" />
                                )}
                              </button>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className={`text-sm font-bold ${isCompleted ? "text-gray-500 line-through" : "text-gray-900"}`}>
                                    {topic.name}
                                  </h4>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    topic.difficulty === "Easy"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : topic.difficulty === "Medium"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-rose-50 text-rose-700"
                                  }`}>
                                    {topic.difficulty}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium mt-1">
                                  {topic.description}
                                </p>
                              </div>
                            </div>

                            {/* Actions bar for notes */}
                            <button
                              type="button"
                              onClick={() => startEditingNote(activeWeek.weekNumber, idx)}
                              className={`text-xs px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold transition-all shrink-0 cursor-pointer ${
                                hasNote
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : "bg-white text-gray-500 border-gray-150 hover:bg-gray-50/80"
                              }`}
                            >
                              <SquarePen className="w-3.5 h-3.5" />
                              {hasNote ? "Edit Note" : "Write Note"}
                            </button>
                          </div>

                          {/* Quick Inline Notepad view */}
                          {editingTopicKey === topicKey ? (
                            <div className="px-4 pb-4 border-t border-gray-100 pt-3 bg-gray-50 rounded-b-2xl">
                              <label className="block text-xs font-bold text-gray-600 mb-1">
                                Custom Note for "{topic.name}":
                              </label>
                              <textarea
                                value={currentNoteText}
                                onChange={(e) => setCurrentNoteText(e.target.value)}
                                rows={3}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-550 focus:border-indigo-550"
                                placeholder="Jot down formulas, core concepts, or checklist reminders for review..."
                              />
                              <div className="flex gap-2 justify-end mt-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingTopicKey(null)}
                                  className="text-xs font-semibold text-gray-500 bg-transparent hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={saveNote}
                                  className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          ) : hasNote ? (
                            <div className="mx-4 mb-4 p-3 bg-indigo-50/15 border border-indigo-100/50 rounded-xl text-xs text-gray-600">
                              <span className="font-bold text-indigo-850">Your Note:</span>{" "}
                              <p className="mt-1 font-serif whitespace-pre-wrap">{progress.notes[topicKey]}</p>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Weekly Deliverable Project */}
                <div className="border border-indigo-150 bg-indigo-50/10 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-indigo-50 via-indigo-50 to-indigo-50 border-b border-indigo-150 px-5 py-4 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-500" /> Weekly Assessment Deliverable
                    </h3>
                    <button
                      type="button"
                      onClick={() => toggleDeliverableCompletion(activeWeek.weekNumber)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-800 border bg-white border-indigo-200 px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      {progress.completedDeliverables.includes(activeWeek.weekNumber)
                        ? "✓ Marked Complete"
                        : "Mark as Completed"}
                    </button>
                  </div>
                  <div className="p-5 flex gap-4 items-start">
                    <div className="p-2 px-3 rounded-xl bg-indigo-650 text-white text-xs font-bold">
                      Task
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{activeWeek.deliverable.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium mt-1">
                        {activeWeek.deliverable.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Weekly Concept Check (Quiz Arena) */}
            {activeTab === "quiz" && (
              <div className="p-6 md:p-8 space-y-6">
                <div className="max-w-2xl mx-auto text-center mb-6">
                  <div className="inline-flex p-2 rounded-full bg-indigo-50 text-indigo-600 mb-2">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Concept Review Arena</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto font-medium">
                    Test your understanding of Week {activeWeek.weekNumber} topics with these custom synthetic questions.
                  </p>
                </div>

                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* If quiz score is saved and we are looking at historic score */}
                  {hasSavedQuizScore && !quizSubmitted && (
                    <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-emerald-800">You completed this checkpoint!</p>
                        <p className="text-sm font-bold text-emerald-990 mt-0.5">
                          Score: {progress.quizScores[activeWeek.weekNumber].score} / {progress.quizScores[activeWeek.weekNumber].total} Questions Correct
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleResetQuiz(activeWeek.weekNumber)}
                        className="text-xs font-bold text-indigo-700 bg-white border border-indigo-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-gray-50"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  )}

                  {activeWeek.quiz.map((item, qIdx) => {
                    const savedScore = progress.quizScores[activeWeek.weekNumber];
                    const selectedIdx = quizSubmitted ? selectedAnswers[qIdx] : (savedScore ? savedScore.selectedAnswers[qIdx] : selectedAnswers[qIdx]);
                    const showFeedback = quizSubmitted || savedScore !== undefined;

                    return (
                      <div key={qIdx} className="bg-gray-50/50 border border-gray-150 rounded-2xl p-5 md:p-6 space-y-4">
                        <div className="flex items-start gap-2.5">
                          <span className="text-xs font-bold text-gray-400 mt-0.5">Q{qIdx + 1}.</span>
                          <h4 className="text-sm font-bold text-gray-800 leading-relaxed">{item.question}</h4>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                          {item.options.map((option, optIdx) => {
                            const isSelected = selectedIdx === optIdx;
                            const isCorrectOption = option === item.correctAnswer;
                            
                            let optionStyle = "border-gray-200 bg-white text-gray-700 hover:border-gray-300";
                            if (isSelected) {
                              optionStyle = "border-indigo-650 bg-indigo-50/40 text-indigo-950 font-bold ring-1 ring-indigo-650";
                            }
                            if (showFeedback) {
                              if (isCorrectOption) {
                                optionStyle = "border-emerald-350 bg-emerald-100/50 text-emerald-900 font-bold ring-1 ring-emerald-350";
                              } else if (isSelected) {
                                optionStyle = "border-rose-350 bg-rose-100/50 text-rose-900 line-through ring-1 ring-rose-350";
                              } else {
                                optionStyle = "border-gray-200 bg-white text-gray-400 opacity-60";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={showFeedback}
                                onClick={() => handleSelectAnswer(qIdx, optIdx)}
                                className={`text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex justify-between items-center ${optionStyle} ${
                                  !showFeedback ? "cursor-pointer" : ""
                                }`}
                              >
                                <span>{option}</span>
                                {showFeedback && isCorrectOption && (
                                  <span className="text-xs font-bold text-emerald-600 shrink-0">✓ Correct Choice</span>
                                )}
                                {showFeedback && isSelected && !isCorrectOption && (
                                  <span className="text-xs font-bold text-rose-600 shrink-0">✗ Incorrect</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {showFeedback && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-indigo-50/10 border border-indigo-100/50 rounded-xl"
                          >
                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
                              <HelpCircle className="w-3 h-3 text-indigo-500" /> Explanation Focus:
                            </span>
                            <p className="text-xs text-gray-600 leading-relaxed font-sans">{item.explanation}</p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}

                  {/* Submit Quiz actions bar */}
                  {!hasSavedQuizScore && !quizSubmitted && (
                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSubmitQuiz(activeWeek.weekNumber, activeWeek.quiz)}
                        className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-sm cursor-pointer"
                      >
                        Submit Selected Answers
                      </button>
                    </div>
                  )}

                  {quizSubmitted && !hasSavedQuizScore && (
                    <div className="p-4 bg-gray-100 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-600">Review complete!</p>
                        <p className="text-xs text-gray-500">Your final scores have been calculated and saved to your syllabus timeline.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleResetQuiz(activeWeek.weekNumber)}
                        className="text-xs font-bold text-indigo-700 bg-white border border-indigo-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-gray-50"
                      >
                        Reset & Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Resources Finder Shortcuts */}
            {activeTab === "overview" && (
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 tracking-tight mb-1">Custom Digital Directory</h3>
                  <p className="text-xs text-gray-400 font-medium">
                    We've generated dynamic directory resources optimized for your chosen learning pace and style. Let's find materials directly:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeWeek.resources.map((res, idx) => {
                    return (
                      <div key={idx} className="bg-gray-50/50 border border-gray-150 p-5 rounded-2xl flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-750 border border-indigo-150 rounded-md">
                              {res.type}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-800 leading-normal">{res.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium mt-1">
                            {res.description}
                          </p>

                          <div className="mt-3 p-2 bg-white border border-gray-150 rounded-xl">
                            <span className="text-[10px] font-bold text-gray-400 block mb-0.5">Highly Recommended Query:</span>
                            <code className="text-[10px] text-gray-700 font-mono block break-all">{res.suggestedSearch}</code>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-150">
                          <a
                            href={getSearchUrl(res.suggestedSearch)}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white border border-gray-200 text-gray-700 hover:text-indigo-600 hover:border-indigo-300 py-2.5 px-3 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-1.5"
                          >
                            <Search className="w-3.5 h-3.5" /> Google Search
                          </a>
                          <a
                            href={getYoutubeUrl(res.suggestedSearch)}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-indigo-50/50 border border-indigo-100 text-indigo-805 hover:bg-indigo-50 py-2.5 px-3 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Watch YouTube
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
