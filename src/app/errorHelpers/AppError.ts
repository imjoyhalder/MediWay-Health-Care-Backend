class AppError extends Error{
    statusCode: number;
    constructor( statusCode: number, message: string, stack='') {
        super(message);
        this.statusCode = statusCode;
        if(this.stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default AppError