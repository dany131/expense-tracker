import * as mongoose from "mongoose";
import { ExpenseCategory, TimeStamps } from "@types";


export const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  amount: Number,
  category: { type: String, enum: ExpenseCategory },
  date: String,
  description: String,
  isRecurring: Boolean

}, { versionKey: false, timestamps: true });

export interface ExpenseModel extends mongoose.Document, TimeStamps {
  user: mongoose.Schema.Types.ObjectId;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
  isRecurring: boolean;
}