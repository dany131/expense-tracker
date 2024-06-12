import * as mongoose from "mongoose";
import { Role, TimeStamps } from "@types";


export const UserSchema = new mongoose.Schema({
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