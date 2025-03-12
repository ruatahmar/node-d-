class apiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong "
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.stack = Error.captureStackTrace(this, this.constructor)
    }
}

export {apiError}