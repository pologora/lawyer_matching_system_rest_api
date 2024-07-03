export const statusCodes = {
  success: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  toManyRequests: 429,
  internalServerError: 500,
} as const;

export type StatusCodes = (typeof statusCodes)[keyof typeof statusCodes];
