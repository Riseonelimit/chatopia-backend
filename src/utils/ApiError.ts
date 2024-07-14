import { ApiErrorInterface } from "../types";

class ApiError extends Error implements ApiErrorInterface {
    statusCode;
    message;
    stack;
    success;
    data;
    errors;
    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = message;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
