class apiResponse {
    status: number;
    data: any;
    message: string;
    success: boolean;
    constructor(statusCode: number, data: any, message = "Success") {
        this.status = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400 ? true : false;
    }
}
//Provides a convenient way to create consistent and structured API responses

export default apiResponse;
//Export ApiResponse Class
