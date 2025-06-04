class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.code = "UNAUTHORIZED";
  }
}

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    this.code = "FORBIDDEN";
  }
}

class ValidationError extends Error {
  constructor(message = "Validation Failed") {
    super(message);
    this.name = "ValidationError";
    this.code = "BAD_USER_INPUT";
  }
}

module.exports = { UnauthorizedError, ForbiddenError, ValidationError };
