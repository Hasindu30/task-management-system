interface ApiResponseOptions {
  success: boolean;
  message: string;
  data?: unknown;
  errors?: unknown[];
}

export const apiResponse = ({ success, message, data, errors }: ApiResponseOptions) => {
  const response: Record<string, unknown> = { success, message };

  if (data !== undefined) {
    response.data = data;
  }

  if (errors !== undefined) {
    response.errors = errors;
  }

  return response;
};
