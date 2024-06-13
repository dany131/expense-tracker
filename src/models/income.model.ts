import * as mongoose from "mongoose";
import { TimeStamps } from "@types";
import { excludeDeletedPlugin } from "@plugins/exclude-deleted.plugin";


const IncomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  amount: Number,
  source: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Source"
  },
  date: Date,
  description: String,
  isRecurring: Boolean,
  isDeleted: Boolean

}, { versionKey: false, timestamps: true });

export interface IncomeModel extends mongoose.Document, TimeStamps {
  _id: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  amount: number;
  source: mongoose.Schema.Types.ObjectId;
  date: Date;
  description: string;
  isRecurring: boolean;
  isDeleted: boolean;
}

IncomeSchema.plugin(excludeDeletedPlugin);

export { IncomeSchema };