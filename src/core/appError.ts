export class AppError implements Error {
  name: string;
  message: string;
  description: string;
  stack?: string;

  constructor(description: string, err?: Error) {
    this.description = description;
    this.name = err?.name;
    this.message = err?.message;
    this.stack = err?.stack;
  }
}
