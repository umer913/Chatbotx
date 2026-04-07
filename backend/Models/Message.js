import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userMessage: String,
  botReply: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Message", messageSchema);