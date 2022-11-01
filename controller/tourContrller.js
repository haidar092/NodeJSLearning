const appError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/APIFeature');
const catchAsync = require('./../utils/catchAsync');
exports.GetTours = catchAsync(async (req, res, next) => {
  // filter
  // const queryObj = { ...req.query };
  // const excludeParm = ["limit", "page", "sort", "fields"];
  // excludeParm.forEach((el) => delete queryObj[el]);

  // const Query = await Tour.find()
  //   .where("duration")
  //   .equals(4)
  //   .where("dificulty")
  //   .equals("dificult");

  // advance filter
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // sort

  // let Query = Tour.find(JSON.parse(queryStr));

  // if (req.query.sort) {
  //   Query = Query.sort(req.query.sort);
  // } else {
  //   Query = Query.sort("-createdAt");
  // }

  //pagination

  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;
  // Query = Query.skip(skip).limit(limit);

  // if (req.query.page) {
  //   const CountTours = await Tour.countDocuments();
  //   if (skip >= CountTours) throw new Error("This Page Does Not Exist");
  // }
  // execute query

  const feature = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const tours = await feature.query;
  res.status(200).json({
    status: 'success',
    result: tours?.length,
    tours,
  });
});

exports.GetTour = catchAsync(async (req, res, next) => {
  const tours = await Tour.findById(req.params.id);
  if (!tours) {
    return next(new appError('No tour found ', 404));
  }
  res.status(200).json({
    status: 'success',

    tours,
  });
});
exports.SingleTour = catchAsync((req, res) => {
  const id = req.body.id * 1;
  // const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    // tour,
  });
});

exports.NewTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: newTour,
  });
  // try {
  //   const newTour = await Tour.create(req.body);
  //   res.status(201).json({
  //     status: 'success',
  //     data: newTour,
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err,
  //   });
  // }
});
exports.UpdateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new appError('No tour found ', 404));
  }
  res.status(200).json({
    status: 'success',

    tour,
  });
});
exports.DeleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new appError('No tour found with this id ', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'deleted successfully',
  });
});

exports.GetTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { maxGroupSize: { $gte: 4.5 } } },
    {
      $group: {
        _id: '$dificulty',
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: -1 } },
  ]);
  res.status(200).json({
    status: 'success',
    stats,
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDate' },
    {
      $match: {
        startDate: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDate' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    {
      $project: {
        _id: 0,
      },
    },
    { $sort: { numToursStarts: -1 } },
    { $limit: 12 },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    plan,
  });
});
