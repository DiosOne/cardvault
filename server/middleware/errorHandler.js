export const errorHandler= (err, req, res, next) => {
    if (process.env.NODE_ENV !== "test") console.error(err);

    //common categories
    const statusCode= err.statusCode || 500;
    const message= 
        err.name === "ValidationError"
            ?Object.values(err.errors).map((val) => val.message).join(",")
            : err.message || "An unexpected error occured on the server.";

    //mongoose bad objectId
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            error: "Invald ID format",
        });
    }

    //jwt errors
    if (err.name === "JsonWebTokenError") {
        return res.status(403).json({
            success: false,
            error: "Invalid or expired token.",
        });
    }

    //general fallback
    res.status(statusCode).json({
        success: false,
        error: message,
    });
};
