import * as mongoose from "mongoose";
import { IncomeCategory, TimeStamps } from "@types";


export const IncomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  amount: Number,
  category: { type: String, enum: IncomeCategory },
  date: String,
  description: String,
  isRecurring: Boolean

}, { versionKey: false, timestamps: true });

export interface IncomeModel extends mongoose.Document, TimeStamps {
  user: mongoose.Schema.Types.ObjectId;
  amount: number;
  category: IncomeCategory;
  date: string;
  description: string;
  isRecurring: boolean;
}