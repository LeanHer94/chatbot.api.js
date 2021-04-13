import { AppError } from "./appError";

const handleError = async (
  error: AppError | Error | {},
  res?: any
): Promise<void> => {
  if (res && error instanceof AppError) {
    res.send(error.description);
  }
};

export { handleError };
