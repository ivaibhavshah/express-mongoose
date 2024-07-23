// Here We have created a synchronous function for handling async errors and functions
// Here next represents to forward function to next process like middleware forwarding process to controller
const asyncHandler = (requestHandler) => (req, res, next) => {
    return Promise.resolve(requestHandler(req,res,next)).catch((err) =>{
        next(err);
    });
}

export { asyncHandler }