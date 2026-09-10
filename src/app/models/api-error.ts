export interface ApiError {
  status: number;
  code: string;
  message: string;
  path: string;
  fieldErrors: Record<string, string>;
}

export function isApiError(value: unknown): value is ApiError {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const apiError = value as ApiError;

  return (
    typeof apiError.status === 'number' &&
    typeof apiError.code === 'string' &&
    typeof apiError.message === 'string' &&
    typeof apiError.path === 'string' &&
    typeof apiError.fieldErrors === 'object' &&
    apiError.fieldErrors !== null &&
    !Array.isArray(apiError.fieldErrors) &&
    Object.values(apiError.fieldErrors).every((error) => typeof error === 'string')
  );
}
