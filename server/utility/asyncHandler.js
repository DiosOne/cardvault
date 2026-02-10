/**
 * Wrap an async route handler to forward errors to Express error middleware.
 * @param {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<unknown>} fn
 * @returns {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void}
 */
export const asyncHandler= (fn) => {
    /**
     * Execute the wrapped handler and forward any rejected promise to next().
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     * @returns {void}
     */
    const wrappedHandler= (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

    return wrappedHandler;
};
