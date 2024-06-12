import * as mongoose from "mongoose";
import { IncomeCategory, TimeStamps } from "@types";


export const SourceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: String,
  sourceType: { type: String, enum: IncomeCategory },
  description: String

}, { versionKey: false, timestamps: true });

export interface SourceModel extends mongoose.Document, TimeStamps {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  sourceType: IncomeCategory;
  description: string;
}