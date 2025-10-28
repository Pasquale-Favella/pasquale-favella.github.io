type Success<T> = {
  err: undefined;
  result: T;
};

type Failure = {
  err: Error;
  result: undefined;
};

type Result<T> = Success<T> | Failure;

export default class PromiseUtils {
  static async tryOf<T>(promise: Promise<T>): Promise<Result<T>> {
    return promise
      .then((result): Success<T> => ({ err: undefined, result }))
      .catch((error): Failure => ({
        err: error instanceof Error ? error : new Error(String(error)),
        result: undefined
      }));
  }
}