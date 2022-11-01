const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour Must Have A Name'],
      unique: true,
      trim: true,
      minlength: 5, maxlength: 15
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Atour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Atour must have maxGroupSize'],
    },
    ratingQuantity: { type: Number, default: 4.5 , max:5 },
    ratingAverage: { type: Number, default: 0 , max:5},
    price: { type: Number, required: [true, 'A Tour Must Have A Price'] },
    dificulty: {
      type: String,
      required: [true, 'A TOUR MUST HAVE DIFICULTY'],
      enum: ['easy', 'dificult']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A TOUR MUST HAVE description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A TOUR MUST HAVE CoverImage'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDate: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// document middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.post("save", function (doc,next) {
// console.log(doc)
//   next();
// });

// query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
