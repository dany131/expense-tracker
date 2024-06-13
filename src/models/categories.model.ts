import * as mongoose from "mongoose";
import { ExpenseCategory, TimeStamps } from "@types";
import { excludeDeletedPlugin } from "@plugins/exclude-deleted.plugin";


const CategoriesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: String,
  categoryType: { type: String, enum: ExpenseCategory },
  description: String,
  isDeleted: Boolean

}, { versionKey: false, timestamps: true });

export interface CategoriesModel extends mongoose.Document, TimeStamps {
  _id: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  categoryType: ExpenseCategory;
  description: string;
  isDeleted: boolean;
}

CategoriesSchema.plugin(excludeDeletedPlugin);

export { CategoriesSchema };