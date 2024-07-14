import { ApiErrorInterface } from "../types";

class DBError extends Error implements Omit<ApiErrorInterface, "statusCode"> {
    message;
    stack;
    success;
    data;
    errors;
    constructor(message = "Something went wrong", errors = [], stack = "") {
        super(message);
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

export default DBError;
