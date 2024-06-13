import * as mongoose from "mongoose";
import { TimeStamps } from "@types";
import { excludeDeletedPlugin } from "@plugins/exclude-deleted.plugin";


const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  amount: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Categories"
  },
  date: Date,
  description: String,
  isRecurring: Boolean,
  isDeleted: Boolean

}, { versionKey: false, timestamps: true });

export interface ExpenseModel extends mongoose.Document, TimeStamps {
  _id: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  amount: number;
  category: mongoose.Schema.Types.ObjectId;
  date: Date;
  description: string;
  isRecurring: boolean;
  isDeleted: boolean;
}

ExpenseSchema.plugin(excludeDeletedPlugin);

export { ExpenseSchema };