import { Schema } from "mongoose";
import { model } from "mongoose";
const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    due_date: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
    },
    status: {
      type: String,
    },
  },

  { timestamps: true }
);

export const Todo = model("Todo", todoSchema);
