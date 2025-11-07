export const errorHandler= (err, req, res, next) => {
    console.error("Error:", err.stack || err.message);

    const statusCode= err.statusCode || 500;
    const message= 
        err.message || "An unexpected error occured on the server.";

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};