export enum ResponseErrorType {
  NOT_FOUND = "Not found",
  UNHANDLED = "Unhandled",
  TOO_MANY_REQUESTS = "To Many Requests",
}

export type ResponseError =
  | { type: ResponseErrorType.NOT_FOUND; message?: string }
  | { type: ResponseErrorType.UNHANDLED; message: string }
  | { type: ResponseErrorType.TOO_MANY_REQUESTS; message?: string };

export async function withResponseError<T>(promise: Promise<T>): Promise<T> {
  return await promise.catch(error => {
    if (typeof error == "object" && "status" in error) {
      // This is a request!
      error = error as Response;
      if (error.status === 404) {
        throw { type: ResponseErrorType.NOT_FOUND };
      }
    }
    if (error.message.toLowerCase().includes(ResponseErrorType.TOO_MANY_REQUESTS.toLowerCase())) {
      throw {
        type: ResponseErrorType.TOO_MANY_REQUESTS,
      };
    }

    // Not found and rate limits are expected and handled by the caller; only log the rest
    console.error("Request failed:", error);
    throw {
      type: ResponseErrorType.UNHANDLED,
      message: error.toString(),
    };
  });
}
