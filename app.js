const express = require('express');
let bodyParser = require('body-parser');
const morgan = require('morgan');
const UserRouter = require('./routes/userRoutes');
const TourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
const globalError = require('./controller/errorController');

const app = express();

console.log(process.env.PORT);
//middleware
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello world my' });
});

app.use('/api/v1/tours', TourRouter);
app.use('/api/v1/users', UserRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalError);

module.exports = app;
