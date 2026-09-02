import mongoose, { Schema } from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("Todo", todoSchema);