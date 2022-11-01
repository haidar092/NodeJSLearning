const AppError = require('./../utils/appError');
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  //opreration errror  trusted erro to client
  // if (err.isOperational) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // error: err,
    // stack: err.stack,
  });
  // } else {
  //   res.status(500).json({
  //     status: 'error',
  //     message: 'Somthing Went Wrong',
  //   });
  // }
};
const handleCastDBError = (err) => {
  const message = `Invalid ${err.path} : ${err.name}`;
  return new AppError(message, 400);
};
const handleDuplicateDBError = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Invalid fiel value ${value} try another`;
  return new AppError(message, 400);
};
const handleValidationDBError = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${error.join('. ')}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (error.name === 'CastError') error = handleCastDBError(error);
    if (error.code === 11000) error = handleDuplicateDBError(error);
    if (error.name === 'ValidationError')
      error = handleValidationDBError(error);
    sendErrorProd(error, res);
  }
};
