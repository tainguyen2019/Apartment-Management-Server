const errorHandling = (error, _, res, __) => {
  const message = error.message || 'Internal Server Error';
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message,
  });
};

module.exports = errorHandling;
