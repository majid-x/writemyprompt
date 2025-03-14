import mongoose from "mongoose";

const PromptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userInput: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  generatedPrompt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use mongoose.models to prevent model recompilation error
export default mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);
