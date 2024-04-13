import middy from "@middy/core"
import httpJsonBodyParser from "@middy/http-json-body-parser";

export const isHttpRequest = (event: any): boolean => {
  return (
    event &&
    typeof event.body === "string" &&
    typeof event.headers === "object" &&
    typeof event.httpMethod === "string" &&
    typeof event.path === "string"
  );
};

export const middyfy = (handler) => {
  return async (event, context, callback) => {
    const middyHandler = middy(handler);
    if (isHttpRequest(event)) {
      middyHandler.use(httpJsonBodyParser());
    }
    return middyHandler(event, context, callback);
  };
}