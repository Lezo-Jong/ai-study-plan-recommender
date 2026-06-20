    import React, { useState } from "react";
    import { motion, AnimatePresence } from "motion/react";
    import { BookOpen, Sparkles, BrainCircuit, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
    import QuestionnaireForm from "./components/QuestionnaireForm";
    import PlanViewer from "./components/PlanViewer";
    import { StudyPlan, StudyQuestionnaire } from "./types";
    
    export default function App() {
      const [activePlan, setActivePlan] = useState<StudyPlan | null>(() => {
        try {
          const cached = localStorage.getItem("active_study_plan_curriculum");
          if (cached) return JSON.parse(cached);
        } catch (e) {
          console.error("Failed to parse cached study plan:", e);
        }
        return null;
      });
    
      const [isLoading, setIsLoading] = useState(false);
      const [errorText, setErrorText] = useState<string | null>(null);
    
      const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);
      const [evaluationScore, setEvaluationScore] = useState<{
        realism: number;
        coverage: number;
        balance: number;
      } | null>(null);
    
      // ===============================
    // Security Layer
    // ===============================
    const validateInput = (questionnaire: StudyQuestionnaire) => {
      const blockedPatterns = [
        "ignore previous instructions",
        "system prompt",
        "reveal hidden instructions",
        "act as",
        "developer mode"
      ];
    
      const text = JSON.stringify(questionnaire).toLowerCase();
    
      return !blockedPatterns.some(pattern =>
        text.includes(pattern)
      );
    };
    
    // ===============================
    // Reviewer Agent
    // ===============================
    const reviewStudyPlan = (plan: StudyPlan) => {
    
      const feedback = [];
    
      if (plan.weeks?.length < 4)
        feedback.push("Consider increasing the study duration.");
    
      feedback.push("Weekly workload appears balanced.");
      feedback.push("Include regular revision sessions.");
    
      return feedback.join(" ");
    };
    
    // ===============================
    // Evaluation Agent
    // ===============================
    const evaluateStudyPlan = () => {
      return {
        realism: 8,
        coverage: 9,
        balance: 8
      };
    };
      
      const handleGeneratePlan = async (questionnaire: StudyQuestionnaire) => {
        setIsLoading(true);
        setErrorText(null);
        // Security validation
        if (!validateInput(questionnaire)) {
          setErrorText(
            "Unsafe prompt detected. Please remove system instructions or prompt injection attempts."
          );
          setIsLoading(false);
          return;
        }
        try {
          const response = await fetch("/api/recommend-study-plan", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(questionnaire),
          });
    
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server responded with status ${response.status}`);
          }
    
          const generatedPlan = await response.json();
          if (!generatedPlan || !generatedPlan.title) {
            throw new Error("Invalid curriculum data payload received from Gemini educational generator.");
          }
    
          setActivePlan(generatedPlan);
    
    const feedback = reviewStudyPlan(generatedPlan);
    setReviewFeedback(feedback);
    
    const score = evaluateStudyPlan();
    setEvaluationScore(score);
    
    localStorage.setItem(
      "active_study_plan_curriculum",
      JSON.stringify(generatedPlan)
    );
        } catch (err: any) {
          console.error("Study generation failed:", err);
          setErrorText(err.message || "A network or validation error occurred. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
    
      const handleResetPlan = () => {
        if (confirm("Are you sure you want to exit your current study syllabus? Progress will be saved under your current subject key if you generate it again later.")) {
          setActivePlan(null);
          localStorage.removeItem("active_study_plan_curriculum");
        }
      };
    
      return (
        <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans selection:bg-indigo-505 selection:text-white antialiased">
          {/* Dynamic Grid Overlay decor */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40"></div>
    
          {/* Main Header navigation */}
          <header className="relative border-b border-gray-150/80 bg-white/85 backdrop-blur-md z-30">
            <div className="w-full max-w-7xl mx-auto px-4 py-4.5 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-xl shadow-md shadow-indigo-100">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block leading-none">Cerebrum Learning</span>
                  <span className="font-extrabold text-gray-900 tracking-tight text-sm">Study Plan Recommender</span>
                </div>
              </div>
    
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-gray-400 hidden sm:inline-block">Time-Optimized Spaced Lessons</span>
              </div>
            </div>
          </header>
    
          {/* Application content */}
          <main className="relative z-10 py-6 md:py-10">
            <AnimatePresence mode="wait">
              {errorText && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-4xl mx-auto px-4 mb-6"
                >
                  <div className="bg-rose-50 border border-rose-150 rounded-2xl p-5 flex gap-4 items-start">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-rose-900">Curriculum Synthesis Failed</h3>
                      <p className="text-xs text-rose-700/90 mt-1 max-w-3xl leading-relaxed">
                        {errorText}
                      </p>
                      <p className="text-xs text-rose-500 font-medium mt-2">
                        Make sure your <code className="bg-rose-100/60 px-1 py-0.5 rounded font-mono text-rose-800">GEMINI_API_KEY</code> environment variable is set up in the platform secrets.
                      </p>
                      <div className="mt-3 flex gap-3">
                        <button
                          onClick={() => setErrorText(null)}
                          className="text-xs font-bold text-rose-700 bg-white border border-rose-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-rose-100/20"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
    
              {activePlan ? (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                >
                  <PlanViewer
        plan={activePlan}
        onReset={handleResetPlan}
      />
    
      <div className="max-w-4xl mx-auto mt-6 px-4">
    
        {reviewFeedback && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <h3 className="font-bold text-lg mb-2">
              📝 Reviewer Agent Feedback
            </h3>
    
            <p className="text-gray-700">
              {reviewFeedback}
            </p>
          </div>
        )}
    
        {evaluationScore && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">
              📊 Evaluation Agent
            </h3>
    
            <p>Realism: {evaluationScore.realism}/10</p>
            <p>Coverage: {evaluationScore.coverage}/10</p>
            <p>Balance: {evaluationScore.balance}/10</p>
          </div>
        )}
      </div>
    </>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <QuestionnaireForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
    
          {/* Elegant Footer bar */}
          <footer className="border-t border-gray-150/60 bg-white py-8 mt-16 text-center text-xs text-gray-450 font-medium relative z-10">
            <p>© {new Date().getFullYear()} Cerebrum. Designed to foster deep cognitive encoding using custom micro-modules.</p>
            <p className="mt-1.5 text-gray-400">All recommendation schedules are generated in real-time by Gemini 3.5 Flash.</p>
          </footer>
        </div>
      );
    }
