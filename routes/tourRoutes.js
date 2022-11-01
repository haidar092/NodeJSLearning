const express = require("express");
const {
  GetTours,
  UpdateTour,
  NewTour,
  GetTour,
  DeleteTour,
  GetTourStats,getMonthlyPlan
} = require("./../controller/tourContrller");
const router = express.Router();

router.route("/tourstats").get(GetTourStats);
router.route("/monthlyplan/:year").get(getMonthlyPlan);
router.route("/").get(GetTours).post(NewTour);
router.route("/:id").get(GetTour).patch(UpdateTour).delete(DeleteTour);

module.exports = router;
