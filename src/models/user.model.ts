import * as mongoose from "mongoose";
import { Role, TimeStamps } from "@types";
import { excludeDeletedPlugin } from "@plugins/exclude-deleted.plugin";


const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profilePicture: String,
  role: { type: String, enum: Role },
  isApproved: Boolean,
  refreshToken: String,
  verificationCode: String,
  isDeleted: Boolean
}, { versionKey: false, timestamps: true });

export interface UserModel extends mongoose.Document, TimeStamps {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  profilePicture: string;
  role: Role;
  isApproved: boolean;
  refreshToken: string;
  verificationCode: string;
  isDeleted: boolean;
}

UserSchema.plugin(excludeDeletedPlugin);

export { UserSchema };