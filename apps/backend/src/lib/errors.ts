export class NotFoundError extends Error {
  readonly statusCode = 404;
  readonly code = "NOT_FOUND";

  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends Error {
  readonly statusCode = 400;
  readonly code = "BAD_REQUEST";

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}
