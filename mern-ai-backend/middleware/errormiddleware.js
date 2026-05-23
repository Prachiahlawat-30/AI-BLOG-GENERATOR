const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    status: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? null : err.stack
  });
};

module.exports = {errorHandler};