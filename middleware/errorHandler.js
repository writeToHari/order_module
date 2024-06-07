const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';

    res.status(statusCode).json({
        error: true,
        status: statusCode,
        message: message
    });
};

module.exports = errorHandler;