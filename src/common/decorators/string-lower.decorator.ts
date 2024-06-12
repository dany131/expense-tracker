import { Transform } from "class-transformer";


/** Decorator to lower a provided string*/

export function StringLower() {
  return Transform(({ value }) => value?.toLowerCase());
}
