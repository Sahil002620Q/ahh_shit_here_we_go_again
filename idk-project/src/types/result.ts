/**
 * Result Type for Error Handling
 */

export type Result<T, E> = 
  | { success: true; value: T }
  | { success: false; error: E };

export function Ok<T, E>(value: T): Result<T, E> {
  return { success: true, value };
}

export function Err<T, E>(error: E): Result<T, E> {
  return { success: false, error };
}
