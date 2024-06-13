import mongoose from "mongoose";


export enum Role {
  SuperUser = "SuperUser",
  User = "User"
}

export interface Tokens {
  access_token: string,
  refresh_token: string
}

export interface TimeStamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiMessage {
  message: string;
}

export interface ApiMessageData extends ApiMessage {
  data: object;
}

export interface ApiMessageDataPagination extends ApiMessageData {
  page: number;
  lastPage: number;
  total: number;
}

export interface PaginationInput<T> {
  model: mongoose.Model<T>;
  page: number;
  limit: number;
  matchingQuery?: mongoose.FilterQuery<any>;
  selectFields?: string,
  sortOptions?: { [key: string]: mongoose.SortOrder },
  populate?: mongoose.PopulateOptions []
}

export interface PaginationOutput {
  data: object[],
  page: number,
  limit: number,
  total: number,
  lastPage: number
}

export enum FieldSelector {
  User = "-password -verificationCode -updatedAt -isDeleted",
}

export enum ExpenseCategory {
  FOOD = "Food",
  TRANSPORTATION = "Transportation",
  ENTERTAINMENT = "Entertainment",
  UTILITIES = "Utilities",
  RENT = "Rent",
  HEALTHCARE = "Healthcare",
  EDUCATION = "Education",
  SUBSCRIPTIONS = "Subscriptions",
  SHOPPING = "Shopping",
  TRAVEL = "Travel",
  OTHER = "Other",
}

export enum IncomeCategory {
  SALARY = "Salary",
  FREELANCE = "Freelance",
  INVESTMENTS = "Investments",
  BUSINESS = "Business",
  RENTAL = "Rental",
  PENSION = "Pension",
  GIFTS = "Gifts",
  OTHER = "Other",
}

export enum TimeFrame {
  Month = "Month",
  Year = "Year",
  Week = "Week",
  Today = "Today"
}