import * as mongoose from "mongoose";
import { IncomeCategory, TimeStamps } from "@types";
import { excludeDeletedPlugin } from "@plugins/exclude-deleted.plugin";


const SourceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: String,
  sourceType: { type: String, enum: IncomeCategory },
  description: String,
  isDeleted: Boolean

}, { versionKey: false, timestamps: true });

export interface SourceModel extends mongoose.Document, TimeStamps {
  _id: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  sourceType: IncomeCategory;
  description: string;
  isDeleted: boolean;
}

SourceSchema.plugin(excludeDeletedPlugin);

export { SourceSchema };