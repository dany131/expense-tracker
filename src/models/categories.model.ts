import * as mongoose from "mongoose";
import { ExpenseCategory, TimeStamps } from "@types";


export const CategoriesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: String,
  categoryType: { type: String, enum: ExpenseCategory },
  description: String

}, { versionKey: false, timestamps: true });

export interface CategoriesModel extends mongoose.Document, TimeStamps {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  categoryType: ExpenseCategory;
  description: string;
}