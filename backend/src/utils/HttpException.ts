export class HttpException extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class ValidationException extends HttpException {
  errors: any[];

  constructor(status: number, message: string, errors: any[]) {
    super(status, message);
    this.errors = errors;
  }
}
