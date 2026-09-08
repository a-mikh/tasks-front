export interface ApiError {
  status: number;
  code: string;
  message: string;
  path: string;
  fieldErrors: Record<string, string>;
}
