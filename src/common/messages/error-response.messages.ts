export const ErrorResponseMessages = {
  // Basic
  USER_NAME: "Invalid name. Name should only contain letters and spaces.",
  PASSWORD_FORMAT: "Password must contain 1 capital letter, 1 number, 1 special character, and be between 8 and 30 characters long",
  EMAIL_EXISTS: "Email already exists",
  INVALID_EMAIL: "Account not found with this email address",
  INVALID_PASSWORD: "Invalid login credentials",
  USER_NOT_EXISTS: "User does not exists",
  INVALID_REFRESH_TOKEN: "Invalid refresh token",
  ACCESS_DENIED: "Access Denied",
  INVALID_CODE: "Invalid verification code",
  ACCOUNT_VERIFIED: "Account is already verified",
  INVALID_AUTHENTICATION: "Invalid authentication token",
  OLD_PASSWORD: "Invalid old password",
  NEW_PASSWORD: "New password can't be old password",
  EMPTY_FILE: "Validation failed (files expected)",
  MONGO_ID: "ID must be valid object id",
  FILE_TYPE: "File type is not matching",
  PERMISSIONS: "You don't have permissions to perform this action",
  NOT_EXISTS: "Not exists",
  INVALID_ACTION: "Can't perform this action",
  ACCOUNT_NOT_APPROVED: "Please approve your account first",

  // App specific
  EXPENSE_EXISTS: "Expense does not exists"

};