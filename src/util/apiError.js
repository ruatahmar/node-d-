class apiError extends error{
    constructor(
        status,
        message = "Something went wrong "
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
    }
}

export {apiError}