import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies
app.use(express.json());

// Lazy-initialize Gemini SDK to prevent crashes if key is omitted on startup
function getGeminiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY environment variable is required. Please add it via Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Structured Study Plan Schema
const studyPlanSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Descriptive title for the study plan. E.g., '4-Week Practical Python Data Science Roadmap'"
    },
    description: {
      type: Type.STRING,
      description: "A tailored, encouraging introduction summarizing the learning strategy for this user, highlighting how the plan aligns with their style and time commitment."
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        totalWeeks: { type: Type.INTEGER },
        hoursPerWeek: { type: Type.INTEGER },
        learningStyleFocus: { type: Type.STRING },
        overallGoal: { type: Type.STRING }
      },
      required: ["totalWeeks", "hoursPerWeek", "learningStyleFocus", "overallGoal"]
    },
    estimatedCompletionTime: {
      type: Type.STRING,
      description: "Total estimated study time, e.g., '40 hours total'"
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 to 4 actionable learning tips specifically curated for their selected learning style and overall goals."
    },
    milestones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          weekIndex: { type: Type.INTEGER }
        },
        required: ["title", "description", "weekIndex"]
      }
    },
    weeks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          weekNumber: { type: Type.INTEGER },
          theme: { type: Type.STRING, description: "Theme or overarching focus of this week" },
          weeklyObjective: { type: Type.STRING, description: "A crisp, specific learning, project, or exam goal for this week." },
          estimatedHours: { type: Type.INTEGER, description: "Target hours to study this week" },
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Specific topic name" },
                description: { type: Type.STRING, description: "Brief overview of what this topic entails" },
                difficulty: { type: Type.STRING, description: "Must be Easy, Medium, or Hard" }
              },
              required: ["name", "description", "difficulty"]
            }
          },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Title of suggested course, textbook chapter, interactive lab or video series" },
                type: { type: Type.STRING, description: "Must be one of: Video Course, Article/Textbook, Interactive Lab, Practice Repo, Podcast/Audio, Interactive Exercise" },
                suggestedSearch: { type: Type.STRING, description: "Specific searchable phrase or online query, e.g., 'freeCodeCamp Responsive Web Design flexbox tutorial' or 'Khan Academy Calculus derivatives'" },
                description: { type: Type.STRING, description: "How this resource helps their specific learning style" }
              },
              required: ["title", "type", "suggestedSearch", "description"]
            }
          },
          deliverable: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A tangible milestone task, exercise, or simple artifact they build/complete to prove understanding" },
              description: { type: Type.STRING, description: "Step-by-step description of what to do" }
            },
            required: ["title", "description"]
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "A multiple choice conceptual question testing understanding of this week's content." },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 options to choose from"
                },
                correctAnswer: { type: Type.STRING, description: "Must exactly match one of the string choices in the options list" },
                explanation: { type: Type.STRING, description: "Clear, immediate pedagogical explanation for why this is the correct answer" }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            },
            description: "Exactly 3 review quiz questions testing knowledge of this week's topics"
          }
        },
        required: ["weekNumber", "theme", "weeklyObjective", "estimatedHours", "topics", "resources", "deliverable", "quiz"]
      }
    }
  },
  required: ["title", "description", "summary", "estimatedCompletionTime", "tips", "milestones", "weeks"]
};

// API Endpoint to request custom study plans
app.post("/api/recommend-study-plan", async (req, res) => {
  try {
    const { subject, currentLevel, hoursPerWeek, durationWeeks, learningStyle, goal } = req.body;

    if (!subject || !currentLevel || !hoursPerWeek || !durationWeeks || !learningStyle || !goal) {
      return res.status(400).json({ error: "Missing required fields in questionnaire payload." });
    }

    const aiClient = getGeminiClient();

    const promptText = `
      You are an expert curriculum designer, cognitive psychologist, and learning developer.
      Review the student information below and create a highly customized study plan:

      Subject/Topic: ${subject}
      Current Level: ${currentLevel} (e.g. beginner, intermediate, advanced)
      Available Weekly Time: ${hoursPerWeek} hours/week
      Desired Commitment Duration: ${durationWeeks} weeks
      Primary Learning Style: ${learningStyle}
      (visual = Diagrams, maps, flowcharts, video lectures;
       practical = Hands-on labs, writing code, building small projects, practicing exercises;
       reading = In-depth textbooks, comprehensive articles, structured note-taking;
       auditory = Podcasts, explainers, group voice discussions, conversational teach-backs)
      Core Learning Goal: ${goal}

      Guidelines:
      - Design exactly ${durationWeeks} weeks of content.
      - Make the study plan highly tailored to their primary learning style:
        * If visual: suggest visual layout tasks, graphic summaries, video courses.
        * If practical: include building apps, working on codepens, GitHub repositories, coding checklists, and hands-on drills.
        * If reading: recommend high-quality textbooks, research documentation, reading summaries, textbook practice problems.
        * If auditory: suggest dictation, recording thoughts, watching spoken explanatory tracks, podcasts.
      - Ensure the difficulty starts at a reasonable pace matching their level (${currentLevel}) and steps up logically.
      - Formulate realistic expectations based on studying ${hoursPerWeek} hours per week.
      - Create exactly 3 multiple choice questions for each week under 'quiz' that tests conceptual understanding of that week's material, complete with detailed explanations.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an elite educational AI curriculum advisor who always formats responses strictly adhering to the JSON schema provided.",
        responseMimeType: "application/json",
        responseSchema: studyPlanSchema,
        temperature: 0.2
      }
    });

    if (!response.text) {
      throw new Error("No response content generated by Gemini.");
    }

    const studyPlan = JSON.parse(response.text.trim());
    return res.json(studyPlan);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred while recommending your study plan."
    });
  }
});

// Setup Vite Dev Server / Static Ingress
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer();
