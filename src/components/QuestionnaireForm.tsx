import React, { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Award, Clock, Calendar, Sparkles, BrainCircuit, Play, Search, GraduationCap } from "lucide-react";
import { StudyQuestionnaire } from "../types";

interface QuestionnaireFormProps {
  onSubmit: (data: StudyQuestionnaire) => void;
  isLoading: boolean;
}

const POPULAR_SUBJECTS = [
  "Python for Data Science",
  "HTML, CSS & React Web Development",
  "AP Calculus BC & Derivatives",
  "Anatomy & Physiology",
  "Organic Chemistry Fundamentals",
  "English IELTS Reading & Prep"
];

const STYLE_META = {
  visual: {
    title: "Visual Learner",
    desc: "Diagrams, graphs, flowcharts, and video lectures fit you best.",
    icon: Sparkles,
    color: "from-blue-500 to-purple-500 border-blue-200"
  },
  practical: {
    title: "Practical & Hands-on",
    desc: "Writing code, solving problem sheets, and working on live labs.",
    icon: BrainCircuit,
    color: "from-emerald-500 to-teal-500 border-emerald-200"
  },
  reading: {
    title: "Reading & Writing",
    desc: "Deep textbooks, comprehensive articles, and text summaries.",
    icon: BookOpen,
    color: "from-amber-500 to-orange-500 border-amber-200"
  },
  auditory: {
    title: "Auditory & Explanatory",
    desc: "Podcasts, group voice lectures, and teaching concepts to others.",
    icon: GraduationCap,
    color: "from-rose-500 to-indigo-500 border-rose-200"
  }
};

export default function QuestionnaireForm({ onSubmit, isLoading }: QuestionnaireFormProps) {
  const [subject, setSubject] = useState("");
  const [currentLevel, setCurrentLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [durationWeeks, setDurationWeeks] = useState<2 | 4 | 6 | 8>(4);
  const [learningStyle, setLearningStyle] = useState<"visual" | "practical" | "reading" | "auditory">("practical");
  const [goal, setGoal] = useState("");

  const handleSuggestClick = (sub: string) => {
    setSubject(sub);
    // Set a matching helpful default goal based on subject selection
    if (sub.includes("React") || sub.includes("Python")) {
      setGoal("Build a production-quality project to add to my coding resume.");
    } else if (sub.includes("AP") || sub.includes("Chemistry")) {
      setGoal("Achieve a high grade (5/5 score) in my upcoming standardized exam.");
    } else {
      setGoal("Learn the fundamental concepts thoroughly for future workplace application.");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    onSubmit({
      subject: subject.trim(),
      currentLevel,
      hoursPerWeek,
      durationWeeks,
      learningStyle,
      goal: goal.trim() || `Master the fundamentals of ${subject} through a structured approach.`
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-6 md:p-10"
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-4 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Curriculum Design
          </span>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
            Custom Study Plan Generator
          </h2>
          <p className="mt-3 text-base text-gray-500">
            Input your parameters below. Our cognitive AI designs a premium weekly blueprint, recommended structured guides, milestones, and quizzes tailored specifically to your learning profile.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* Section 1: Subject / Topic */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              What core subject or skill are you studying?
            </label>
            <div className="relative">
              <input
                id="subject-input"
                type="text"
                required
                placeholder="E.g., Machine Learning Fundamentals, AP Biology, Organic Chemistry, Node.js..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans text-sm"
              />
            </div>
            
            {/* Suggestions list */}
            <div className="flex flex-wrap gap-2 pt-1.5">
              <span className="text-xs text-gray-400 self-center font-medium">Quick Suggestions:</span>
              {POPULAR_SUBJECTS.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSuggestClick(sub)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all font-medium ${
                    subject === sub
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 2: Current Level */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-500" />
                What is your current level of understanding?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCurrentLevel(lvl)}
                    className={`py-3 px-1.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      currentLevel === lvl
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Commitment Horizon */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                How many weeks can you commit?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {([2, 4, 6, 8] as const).map((wks) => (
                  <button
                    key={wks}
                    type="button"
                    onClick={() => setDurationWeeks(wks)}
                    className={`py-3 px-1 rounded-xl border text-xs font-semibold transition-all ${
                      durationWeeks === wks
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {wks} Weeks
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Study Time Slider */}
          <div className="space-y-3 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Available weekly study time
              </label>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                {hoursPerWeek} Hours / Week
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
            <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
              <span>Light Cramming (2h)</span>
              <span>Balanced Study (10-15h)</span>
              <span>Intensive Mastery (40h)</span>
            </div>
          </div>

          {/* Section 5: Learning Style */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">
              Select your preferred learning style:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.keys(STYLE_META) as Array<"visual" | "practical" | "reading" | "auditory">).map((style) => {
                const meta = STYLE_META[style];
                const IconComp = meta.icon;
                const isSelected = learningStyle === style;
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setLearningStyle(style)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all group ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50/20 ring-1 ring-indigo-500"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl bg-gradient-to-br ${meta.color} transition-all ${
                        isSelected ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{meta.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">
                        {meta.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 6: Specific Goal */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">
              What is your main goal or learning outcome?
            </label>
            <textarea
              rows={3}
              placeholder="E.g., I have an exam in 3 weeks and need to focus on exam application, or I want to build code models for an AI startup, or I just want a basic introductory grasp..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans text-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              id="generate-plan-btn"
              type="submit"
              disabled={isLoading || !subject.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-150 transition-all duration-150 flex items-center justify-center gap-2 disabled:bg-gray-350 disabled:shadow-none cursor-pointer text-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Synthesizing Custom Study Curriculum...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  Generate Recommended Study Plan
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
